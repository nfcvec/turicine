namespace Turicine.Catalogo.Models.ReadModels;

public sealed class CategoryReadModel
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;
}
