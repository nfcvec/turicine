namespace Turicine.Catalogo.Models.ReadModels;

public sealed class MovieReadModel
{
    public Guid Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string? Synopsis { get; init; }

    public Guid CategoryId { get; init; }

    public CategorySummaryReadModel? Category { get; init; }

    public int DurationSeconds { get; init; }

    public bool IsVisible { get; init; }

    public string? Directors { get; init; }

    public string? Cast { get; init; }

    public IReadOnlyList<ImageReadModel> Images { get; init; } = [];

    public IReadOnlyList<VenueSummaryReadModel> Venues { get; init; } = [];
}
