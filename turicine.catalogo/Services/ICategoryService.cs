using Turicine.Catalogo.Contracts.Categories;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Models.ReadModels;

namespace Turicine.Catalogo.Services;

public enum CategoryDeleteResult
{
    Deleted,
    NotFound,
    InUse
}

public interface ICategoryService
{
    Task<Category> CreateAsync(CreateCategoryRequest request, CancellationToken cancellationToken = default);

    Task<Category?> UpdateAsync(Guid id, UpdateCategoryRequest request, CancellationToken cancellationToken = default);

    Task<CategoryDeleteResult> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);

    IQueryable<CategoryReadModel> Query();
}
