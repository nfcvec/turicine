using System.ComponentModel.DataAnnotations;

namespace Turicine.Catalogo.Options;

public sealed class CloudflareImagesOptions
{
    public const string SectionName = "CloudflareImages";
    public const string HttpClientName = "CloudflareImages";

    [Required]
    [MaxLength(32)]
    public string AccountId { get; init; } = string.Empty;

    [Required]
    public string ApiToken { get; init; } = string.Empty;

    // Account-specific delivery host (imagedelivery.net/<hash>), no trailing slash.
    // Public and safe to expose: it appears in every delivered image URL.
    [Required]
    [Url]
    public string DeliveryBaseUrl { get; init; } = string.Empty;
}
