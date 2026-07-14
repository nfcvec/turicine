using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Images;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

[ApiController]
[Route("api/movies/{movieId:guid}/images")]
public sealed class MovieImagesController(
    IMovieService movieService,
    IImageService imageService) : ControllerBase
{
    [HttpPost]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(ImageService.MaxImageSizeBytes + 1024 * 1024)]
    [ProducesResponseType<ImageResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status502BadGateway)]
    public async Task<ActionResult<ImageResponse>> Upload(
        Guid movieId,
        [FromForm] IFormFile file,
        CancellationToken cancellationToken)
    {
        if (!await movieService.ExistsAsync(movieId, cancellationToken))
        {
            return NotFound();
        }

        if (file is null || file.Length == 0)
        {
            return BadRequest(CreateProblem("An image file is required."));
        }

        if (file.Length > ImageService.MaxImageSizeBytes)
        {
            return BadRequest(CreateProblem("The image cannot exceed 10 MB."));
        }

        try
        {
            await using var content = file.OpenReadStream();
            var image = await imageService.SaveAsync(
                content,
                file.FileName,
                file.ContentType,
                file.Length,
                cancellationToken);

            await movieService.AttachImageAsync(movieId, image.Id, cancellationToken);

            return StatusCode(StatusCodes.Status201Created, ImageResponse.FromEntity(image));
        }
        catch (ArgumentException exception)
        {
            return BadRequest(CreateProblem(exception.Message));
        }
        catch (CloudflareImagesException)
        {
            return StatusCode(
                StatusCodes.Status502BadGateway,
                CreateProblem("The image store rejected the upload.", StatusCodes.Status502BadGateway));
        }
    }

    [HttpDelete("{imageId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid movieId, Guid imageId, CancellationToken cancellationToken)
    {
        var deleted = await movieService.RemoveImageAsync(movieId, imageId, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPut("order")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Reorder(
        Guid movieId,
        [FromBody] ReorderImagesRequest request,
        CancellationToken cancellationToken)
    {
        if (!await movieService.ExistsAsync(movieId, cancellationToken))
        {
            return NotFound();
        }

        var reordered = await movieService.ReorderImagesAsync(movieId, request.ImageIds, cancellationToken);
        return reordered
            ? NoContent()
            : BadRequest(CreateProblem("The image ids must match exactly the movie's images."));
    }

    private ProblemDetails CreateProblem(string detail, int status = StatusCodes.Status400BadRequest) => new()
    {
        Status = status,
        Title = status == StatusCodes.Status400BadRequest ? "Bad Request" : "Bad Gateway",
        Detail = detail,
        Instance = HttpContext.Request.Path
    };
}
