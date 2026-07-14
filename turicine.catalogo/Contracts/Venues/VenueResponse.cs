using Turicine.Catalogo.Models.Entities;

namespace Turicine.Catalogo.Contracts.Venues;

public sealed record VenueResponse(
    Guid Id,
    string Name,
    string? Address,
    string? MapsUrl,
    string? WhatsappNumber,
    string? PhoneNumber)
{
    public static VenueResponse FromEntity(Venue venue) => new(
        venue.Id,
        venue.Name,
        venue.Address,
        venue.MapsUrl,
        venue.WhatsappNumber,
        venue.PhoneNumber);
}
