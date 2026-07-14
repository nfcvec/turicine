namespace Turicine.Catalogo.Contracts.Movies;

public sealed record SetMovieVenuesRequest(IReadOnlyList<Guid> VenueIds);
