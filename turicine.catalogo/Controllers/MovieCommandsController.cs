using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Movies;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

[ApiController]
[Route("api/movies")]
public sealed class MovieCommandsController(IMovieService movieService, ICategoryService categoryService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<MovieResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MovieResponse>> Create(
        [FromBody] CreateMovieRequest request,
        CancellationToken cancellationToken)
    {
        if (!await categoryService.ExistsAsync(request.CategoryId, cancellationToken))
        {
            ModelState.AddModelError(nameof(request.CategoryId), "La categoría no existe.");
            return ValidationProblem(ModelState);
        }

        var movie = await movieService.CreateAsync(request, cancellationToken);
        var response = MovieResponse.FromEntity(movie);

        return Created($"odata/Movies({movie.Id})", response);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<MovieResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MovieResponse>> Update(
        Guid id,
        [FromBody] UpdateMovieRequest request,
        CancellationToken cancellationToken)
    {
        if (!await categoryService.ExistsAsync(request.CategoryId, cancellationToken))
        {
            ModelState.AddModelError(nameof(request.CategoryId), "La categoría no existe.");
            return ValidationProblem(ModelState);
        }

        var movie = await movieService.UpdateAsync(id, request, cancellationToken);
        return movie is null ? NotFound() : Ok(MovieResponse.FromEntity(movie));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await movieService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPut("{id:guid}/visibility")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SetVisibility(
        Guid id,
        [FromBody] SetVisibilityRequest request,
        CancellationToken cancellationToken)
    {
        var updated = await movieService.SetVisibilityAsync(id, request.IsVisible, cancellationToken);
        return updated ? NoContent() : NotFound();
    }
}
