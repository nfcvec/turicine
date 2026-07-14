using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Turicine.Catalogo.Data;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Options;

namespace Turicine.Catalogo.Services;

public sealed class ImageService(
    AppDbContext dbContext,
    IHttpClientFactory httpClientFactory,
    IOptions<CloudflareImagesOptions> options,
    ILogger<ImageService> logger) : IImageService
{
    public const long MaxImageSizeBytes = 10 * 1024 * 1024;

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly CloudflareImagesOptions _options = options.Value;

    public async Task<Image> SaveAsync(
        Stream content,
        string fileName,
        string contentType,
        long sizeBytes,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(content);

        var safeFileName = Path.GetFileName(fileName);
        ValidateInput(safeFileName, contentType, sizeBytes);

        var client = httpClientFactory.CreateClient(CloudflareImagesOptions.HttpClientName);
        using var request = CreateUploadRequest(content, safeFileName, contentType);
        HttpResponseMessage response;
        try
        {
            response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        }
        catch (HttpRequestException exception)
        {
            throw new CloudflareImagesException(
                "Cloudflare Images could not be reached.",
                System.Net.HttpStatusCode.BadGateway,
                exception);
        }

        using (response)
        {
            CloudflareEnvelope? cloudflareResponse = null;

            try
            {
                cloudflareResponse = await response.Content.ReadFromJsonAsync<CloudflareEnvelope>(JsonOptions, cancellationToken);
            }
            catch (JsonException)
            {
                // The consistent exception below hides provider response details from the public API.
            }

            if (!response.IsSuccessStatusCode || cloudflareResponse is not { Success: true, Result.Id.Length: > 0 })
            {
                var error = cloudflareResponse?.Errors?.FirstOrDefault()?.Message ?? "Cloudflare Images rejected the upload.";
                throw new CloudflareImagesException(error, response.StatusCode);
            }

            var image = new Image
            {
                Id = Guid.NewGuid(),
                CloudflareImageId = cloudflareResponse.Result.Id,
                FileName = safeFileName,
                ContentType = contentType,
                SizeBytes = sizeBytes,
                UploadedAtUtc = DateTimeOffset.UtcNow
            };

            dbContext.Images.Add(image);

            try
            {
                await dbContext.SaveChangesAsync(cancellationToken);
                return image;
            }
            catch
            {
                await DeleteFromCloudflareCoreAsync(client, image.CloudflareImageId, CancellationToken.None);
                throw;
            }
        }
    }

    private HttpRequestMessage CreateUploadRequest(Stream content, string fileName, string contentType)
    {
        var streamContent = new StreamContent(content);
        streamContent.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);

        var multipartContent = new MultipartFormDataContent();
        multipartContent.Add(streamContent, "file", fileName);

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"accounts/{Uri.EscapeDataString(_options.AccountId)}/images/v1")
        {
            Content = multipartContent
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiToken);

        return request;
    }

    // Generic asset deletion: removes the DB row and then the Cloudflare image.
    public async Task<bool> DeleteAsync(Guid imageId, CancellationToken cancellationToken = default)
    {
        var image = await dbContext.Images.FirstOrDefaultAsync(i => i.Id == imageId, cancellationToken);
        if (image is null)
        {
            return false;
        }

        var cloudflareImageId = image.CloudflareImageId;
        dbContext.Images.Remove(image);
        await dbContext.SaveChangesAsync(cancellationToken);

        await DeleteFromCloudflareAsync(cloudflareImageId, cancellationToken);
        return true;
    }

    public Task DeleteFromCloudflareAsync(string cloudflareImageId, CancellationToken cancellationToken = default)
    {
        var client = httpClientFactory.CreateClient(CloudflareImagesOptions.HttpClientName);
        return DeleteFromCloudflareCoreAsync(client, cloudflareImageId, cancellationToken);
    }

    private async Task DeleteFromCloudflareCoreAsync(HttpClient client, string cloudflareImageId, CancellationToken cancellationToken)
    {
        try
        {
            using var request = new HttpRequestMessage(
                HttpMethod.Delete,
                $"accounts/{Uri.EscapeDataString(_options.AccountId)}/images/v1/{Uri.EscapeDataString(cloudflareImageId)}");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiToken);

            using var response = await client.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning(
                    "Cloudflare image {CloudflareImageId} could not be removed. Status: {StatusCode}",
                    cloudflareImageId,
                    response.StatusCode);
            }
        }
        catch (Exception exception)
        {
            logger.LogWarning(
                exception,
                "Cloudflare image {CloudflareImageId} could not be removed.",
                cloudflareImageId);
        }
    }

    private static void ValidateInput(string fileName, string contentType, long sizeBytes)
    {
        if (string.IsNullOrWhiteSpace(fileName) || fileName.Length > 255)
        {
            throw new ArgumentException("The file name is required and cannot exceed 255 characters.", nameof(fileName));
        }

        if (string.IsNullOrWhiteSpace(contentType) ||
            contentType.Length > 100 ||
            !contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("The uploaded file must have a valid image content type.", nameof(contentType));
        }

        if (sizeBytes is <= 0 or > MaxImageSizeBytes)
        {
            throw new ArgumentOutOfRangeException(
                nameof(sizeBytes),
                $"The image must be between 1 byte and {MaxImageSizeBytes} bytes.");
        }
    }

    private sealed record CloudflareEnvelope(
        bool Success,
        CloudflareImageResult Result,
        IReadOnlyList<CloudflareError>? Errors);

    private sealed record CloudflareImageResult(string Id);

    private sealed record CloudflareError(string Message);
}
