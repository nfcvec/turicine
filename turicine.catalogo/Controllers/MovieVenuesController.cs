using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Movies;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

[ApiController]
[Route("api/movies/{movieId:guid}/venues")]
public sealed class MovieVenuesController(IMovieService movieService) : ControllerBase
{
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Set(
        Guid movieId,
        [FromBody] SetMovieVenuesRequest request,
        CancellationToken cancellationToken)
    {
        if (!await movieService.ExistsAsync(movieId, cancellationToken))
        {
            return NotFound();
        }

        var ok = await movieService.SetVenuesAsync(movieId, request.VenueIds, cancellationToken);
        return ok
            ? NoContent()
            : BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Bad Request",
                Detail = "One or more venue ids do not exist.",
                Instance = HttpContext.Request.Path,
            });
    }
}
