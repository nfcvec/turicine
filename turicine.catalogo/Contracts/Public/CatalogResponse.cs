namespace Turicine.Catalogo.Contracts.Public;

// Public, composed catalog for the landing site (BFF). Read-only, anonymous.
public sealed class CatalogResponse
{
    public IReadOnlyList<CatalogCategoryDto> Categories { get; init; } = [];
}

public sealed class CatalogCategoryDto
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public IReadOnlyList<CatalogMovieDto> Movies { get; init; } = [];
}

public sealed class CatalogMovieDto
{
    public Guid Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string? Synopsis { get; init; }

    public int DurationSeconds { get; init; }

    public string? Directors { get; init; }

    public string? Cast { get; init; }

    // Full Cloudflare delivery URLs, ordered as in the carousel. Empty when the
    // movie has no images yet (the landing renders a placeholder).
    public IReadOnlyList<string> Images { get; init; } = [];

    // Cines/sedes donde se proyecta. Todos los campos salvo Name son opcionales.
    public IReadOnlyList<CatalogVenueDto> Venues { get; init; } = [];
}

public sealed class CatalogVenueDto
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? Address { get; init; }

    public string? MapsUrl { get; init; }

    public string? WhatsappNumber { get; init; }

    public string? PhoneNumber { get; init; }

    // Full Cloudflare delivery URL of the venue logo, or null if it has none.
    public string? LogoUrl { get; init; }
}
