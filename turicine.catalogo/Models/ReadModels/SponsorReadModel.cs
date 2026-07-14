namespace Turicine.Catalogo.Models.ReadModels;

public sealed class SponsorReadModel
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public Guid LogoImageId { get; init; }

    public string? LogoCloudflareImageId { get; init; }
}
