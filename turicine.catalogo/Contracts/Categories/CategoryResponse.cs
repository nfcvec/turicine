using Turicine.Catalogo.Models.Entities;

namespace Turicine.Catalogo.Contracts.Categories;

public sealed record CategoryResponse(
    Guid Id,
    string Name)
{
    public static CategoryResponse FromEntity(Category category) => new(
        category.Id,
        category.Name);
}
