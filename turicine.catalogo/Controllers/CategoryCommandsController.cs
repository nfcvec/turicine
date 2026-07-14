using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Categories;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

[ApiController]
[Route("api/categories")]
public sealed class CategoryCommandsController(ICategoryService categoryService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<CategoryResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CategoryResponse>> Create(
        [FromBody] CreateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var category = await categoryService.CreateAsync(request, cancellationToken);
        return Created($"odata/Categories({category.Id})", CategoryResponse.FromEntity(category));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<CategoryResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoryResponse>> Update(
        Guid id,
        [FromBody] UpdateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var category = await categoryService.UpdateAsync(id, request, cancellationToken);
        return category is null ? NotFound() : Ok(CategoryResponse.FromEntity(category));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await categoryService.DeleteAsync(id, cancellationToken);
        return result switch
        {
            CategoryDeleteResult.Deleted => NoContent(),
            CategoryDeleteResult.NotFound => NotFound(),
            _ => Conflict(new ProblemDetails
            {
                Title = "Categoría en uso",
                Detail = "No se puede borrar una categoría con películas asociadas."
            })
        };
    }
}
