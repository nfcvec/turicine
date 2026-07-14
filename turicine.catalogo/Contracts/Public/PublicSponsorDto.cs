namespace Turicine.Catalogo.Contracts.Public;

// Public sponsor for the landing footer carousel: name (alt text) + logo URL.
public sealed class PublicSponsorDto
{
    public string Name { get; init; } = string.Empty;

    public string LogoUrl { get; init; } = string.Empty;
}
