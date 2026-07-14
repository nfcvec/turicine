using Microsoft.EntityFrameworkCore;
using Turicine.Catalogo.Contracts.Categories;
using Turicine.Catalogo.Data;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Models.ReadModels;

namespace Turicine.Catalogo.Services;

public sealed class CategoryService(AppDbContext dbContext) : ICategoryService
{
    public async Task<Category> CreateAsync(CreateCategoryRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim()
        };

        dbContext.Categories.Add(category);
        await dbContext.SaveChangesAsync(cancellationToken);
        return category;
    }

    public async Task<Category?> UpdateAsync(Guid id, UpdateCategoryRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var category = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (category is null)
        {
            return null;
        }

        category.Name = request.Name.Trim();
        await dbContext.SaveChangesAsync(cancellationToken);
        return category;
    }

    public async Task<CategoryDeleteResult> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (category is null)
        {
            return CategoryDeleteResult.NotFound;
        }

        if (await dbContext.Movies.AnyAsync(m => m.CategoryId == id, cancellationToken))
        {
            return CategoryDeleteResult.InUse;
        }

        dbContext.Categories.Remove(category);
        await dbContext.SaveChangesAsync(cancellationToken);
        return CategoryDeleteResult.Deleted;
    }

    public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default) =>
        dbContext.Categories.AnyAsync(c => c.Id == id, cancellationToken);

    public IQueryable<CategoryReadModel> Query() =>
        dbContext.Categories
            .AsNoTracking()
            .Select(category => new CategoryReadModel
            {
                Id = category.Id,
                Name = category.Name
            });
}
