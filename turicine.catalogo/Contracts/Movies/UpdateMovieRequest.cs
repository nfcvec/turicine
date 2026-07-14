using System.ComponentModel.DataAnnotations;

namespace Turicine.Catalogo.Contracts.Movies;

public sealed record UpdateMovieRequest(
    [Required]
    [MaxLength(255)]
    string Title,

    string? Synopsis,

    [Required]
    Guid CategoryId,

    [Range(0, int.MaxValue)]
    int DurationSeconds,

    [MaxLength(500)]
    string? Directors,

    string? Cast,

    bool? IsVisible = true);
