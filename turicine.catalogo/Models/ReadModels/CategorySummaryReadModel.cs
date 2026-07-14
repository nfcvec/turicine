namespace Turicine.Catalogo.Models.ReadModels;

// Inline complex type serialized within each Movie (mirrors VenueSummaryReadModel),
// so the movie carries its category name without a navigation to the Categories set.
public sealed class CategorySummaryReadModel
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;
}
