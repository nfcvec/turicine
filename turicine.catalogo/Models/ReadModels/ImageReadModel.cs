namespace Turicine.Catalogo.Models.ReadModels;

// Complex type (no key) -> serialized inline inside MovieReadModel by OData.
public sealed class ImageReadModel
{
    public Guid Id { get; init; }

    public string CloudflareImageId { get; init; } = string.Empty;

    public int CarouselOrder { get; init; }
}
