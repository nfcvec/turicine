using System.ComponentModel.DataAnnotations;

namespace Turicine.Catalogo.Contracts.Leads;

public sealed record CreateLeadRequest(
    [Required]
    [MaxLength(200)]
    string FullName,

    [Required]
    [EmailAddress]
    [MaxLength(200)]
    string Email,

    string? Message,

    [MaxLength(200)]
    string? Topic);
