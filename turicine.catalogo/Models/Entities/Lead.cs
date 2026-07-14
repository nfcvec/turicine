using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Turicine.Catalogo.Models.Entities;

// Contact/alliance inquiry captured from the public landing forms.
[Index(nameof(IsDownloaded))]
[Index(nameof(CreatedAtUtc))]
public class Lead
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    public string? Message { get; set; }

    [MaxLength(200)]
    public string? Topic { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    public bool IsDownloaded { get; set; }

    public DateTimeOffset? DownloadedAtUtc { get; set; }
}
