using System.ComponentModel.DataAnnotations;

namespace Turicine.Catalogo.Contracts.Venues;

public sealed record CreateVenueRequest(
    [Required]
    [MaxLength(200)]
    string Name,

    [MaxLength(300)]
    string? Address,

    [MaxLength(500)]
    string? MapsUrl,

    [MaxLength(500)]
    string? WhatsappNumber,

    [MaxLength(40)]
    string? PhoneNumber);
