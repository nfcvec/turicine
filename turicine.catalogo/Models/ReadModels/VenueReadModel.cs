namespace Turicine.Catalogo.Models.ReadModels;

public sealed class VenueReadModel
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? Address { get; init; }

    public string? MapsUrl { get; init; }

    public string? WhatsappNumber { get; init; }

    public string? PhoneNumber { get; init; }

    public Guid? LogoImageId { get; init; }

    public string? LogoCloudflareImageId { get; init; }
}
