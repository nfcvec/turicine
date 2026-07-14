using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Turicine.Catalogo.Models.Entities;

// Generic uploaded asset (Cloudflare Images). Business objects reference it via
// their own relations (MovieImage for a movie carousel, Venue.Logo, etc.).
[Index(nameof(CloudflareImageId), IsUnique = true)]
public class Image
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(64)]
    public string CloudflareImageId { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ContentType { get; set; } = string.Empty;

    public long SizeBytes { get; set; }

    public DateTimeOffset UploadedAtUtc { get; set; }
}
