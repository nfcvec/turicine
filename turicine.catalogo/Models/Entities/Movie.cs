using System.ComponentModel.DataAnnotations;

namespace Turicine.Catalogo.Models.Entities;

public class Movie
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    public string? Synopsis { get; set; }

    public Guid CategoryId { get; set; }

    public Category? Category { get; set; }

    public int DurationSeconds { get; set; }

    // Controls whether the movie is shown on the public landing catalog.
    public bool IsVisible { get; set; } = true;

    [MaxLength(500)]
    public string? Directors { get; set; }

    public string? Cast { get; set; }

    public ICollection<MovieImage> MovieImages { get; set; } = new List<MovieImage>();

    public ICollection<Venue> Venues { get; set; } = new List<Venue>();
}
