using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Sponsors;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

[ApiController]
[Route("api/sponsors")]
public sealed class SponsorCommandsController(
    ISponsorService sponsorService,
    IImageService imageService) : ControllerBase
{
    // Create requires both name and logo; upload the image first, then the sponsor.
    [HttpPost]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(ImageService.MaxImageSizeBytes + 1024 * 1024)]
    [ProducesResponseType<SponsorResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status502BadGateway)]
    public async Task<ActionResult<SponsorResponse>> Create(
        [FromForm] string name,
        [FromForm] IFormFile file,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest(CreateProblem("El nombre es obligatorio."));
        }

        var validation = ValidateFile(file);
        if (validation is not null)
        {
            return BadRequest(CreateProblem(validation));
        }

        try
        {
            await using var content = file.OpenReadStream();
            var image = await imageService.SaveAsync(
                content, file.FileName, file.ContentType, file.Length, cancellationToken);

            try
            {
                var sponsor = await sponsorService.CreateAsync(name, image.Id, cancellationToken);
                return StatusCode(StatusCodes.Status201Created, SponsorResponse.FromEntity(sponsor));
            }
            catch
            {
                // Roll back the orphaned asset if persisting the sponsor failed.
                await imageService.DeleteAsync(image.Id, cancellationToken);
                throw;
            }
        }
        catch (ArgumentException exception)
        {
            return BadRequest(CreateProblem(exception.Message));
        }
        catch (CloudflareImagesException)
        {
            return StatusCode(
                StatusCodes.Status502BadGateway,
                CreateProblem("El almacén de imágenes rechazó la subida.", StatusCodes.Status502BadGateway));
        }
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<SponsorResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SponsorResponse>> UpdateName(
        Guid id,
        [FromBody] UpdateSponsorRequest request,
        CancellationToken cancellationToken)
    {
        var sponsor = await sponsorService.UpdateNameAsync(id, request.Name, cancellationToken);
        return sponsor is null ? NotFound() : Ok(SponsorResponse.FromEntity(sponsor));
    }

    [HttpPut("{id:guid}/logo")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(ImageService.MaxImageSizeBytes + 1024 * 1024)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status502BadGateway)]
    public async Task<IActionResult> ReplaceLogo(
        Guid id,
        [FromForm] IFormFile file,
        CancellationToken cancellationToken)
    {
        var validation = ValidateFile(file);
        if (validation is not null)
        {
            return BadRequest(CreateProblem(validation));
        }

        try
        {
            await using var content = file.OpenReadStream();
            var image = await imageService.SaveAsync(
                content, file.FileName, file.ContentType, file.Length, cancellationToken);

            var ok = await sponsorService.ReplaceLogoAsync(id, image.Id, cancellationToken);
            if (!ok)
            {
                await imageService.DeleteAsync(image.Id, cancellationToken);
                return NotFound();
            }

            return NoContent();
        }
        catch (ArgumentException exception)
        {
            return BadRequest(CreateProblem(exception.Message));
        }
        catch (CloudflareImagesException)
        {
            return StatusCode(
                StatusCodes.Status502BadGateway,
                CreateProblem("El almacén de imágenes rechazó la subida.", StatusCodes.Status502BadGateway));
        }
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await sponsorService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private static string? ValidateFile(IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            return "Se requiere un archivo de logo.";
        }
        if (file.Length > ImageService.MaxImageSizeBytes)
        {
            return "El logo no puede superar los 10 MB.";
        }
        return null;
    }

    private ProblemDetails CreateProblem(string detail, int status = StatusCodes.Status400BadRequest) => new()
    {
        Status = status,
        Title = status == StatusCodes.Status400BadRequest ? "Bad Request" : "Bad Gateway",
        Detail = detail,
        Instance = HttpContext.Request.Path
    };
}
