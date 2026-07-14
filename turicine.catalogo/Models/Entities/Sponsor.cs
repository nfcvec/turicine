using System.ComponentModel.DataAnnotations;

namespace Turicine.Catalogo.Models.Entities;

// Festival sponsor/auspiciante. Both name and logo are mandatory; the logo is a
// generic Image asset (Cloudflare) referenced by LogoImageId.
public class Sponsor
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public Guid LogoImageId { get; set; }

    public Image? Logo { get; set; }
}
