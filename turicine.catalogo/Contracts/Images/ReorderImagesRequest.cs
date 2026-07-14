namespace Turicine.Catalogo.Contracts.Images;

// New order of the movie's images: ImageIds[0] becomes CarouselOrder 0, etc.
public sealed record ReorderImagesRequest(IReadOnlyList<Guid> ImageIds);
