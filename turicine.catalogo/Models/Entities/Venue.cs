using System.ComponentModel.DataAnnotations;

namespace Turicine.Catalogo.Models.Entities;

public class Venue
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Address { get; set; }

    [MaxLength(500)]
    public string? MapsUrl { get; set; }

    // WhatsApp number (digits, optionally with country code). The landing builds
    // the wa.me link with a prefilled message; the portal only stores the number.
    [MaxLength(40)]
    public string? WhatsappNumber { get; set; }

    [MaxLength(40)]
    public string? PhoneNumber { get; set; }

    public Guid? LogoImageId { get; set; }

    public Image? Logo { get; set; }

    public ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
