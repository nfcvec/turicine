using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Images;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

[ApiController]
[Route("api/images")]
public sealed class ImagesController(IImageService imageService) : ControllerBase
{
    [HttpPost]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(ImageService.MaxImageSizeBytes + 1024 * 1024)]
    [ProducesResponseType<ImageResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status502BadGateway)]
    public async Task<ActionResult<ImageResponse>> Save([FromForm] IFormFile file, CancellationToken cancellationToken)
    {
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

    private ProblemDetails CreateProblem(string detail, int status = StatusCodes.Status400BadRequest) => new()
    {
        Status = status,
        Title = status == StatusCodes.Status400BadRequest ? "Bad Request" : "Bad Gateway",
        Detail = detail,
        Instance = HttpContext.Request.Path
    };
}
