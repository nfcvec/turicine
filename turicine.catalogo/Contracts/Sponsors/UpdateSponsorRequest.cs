using System.ComponentModel.DataAnnotations;

namespace Turicine.Catalogo.Contracts.Sponsors;

public sealed record UpdateSponsorRequest(
    [Required]
    [MaxLength(200)]
    string Name);
