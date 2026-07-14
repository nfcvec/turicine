using Turicine.Catalogo.Models.Entities;

namespace Turicine.Catalogo.Contracts.Images;

public sealed record ImageResponse(
    Guid Id,
    string CloudflareImageId,
    string FileName,
    string ContentType,
    long SizeBytes,
    DateTimeOffset UploadedAtUtc)
{
    public static ImageResponse FromEntity(Image image) => new(
        image.Id,
        image.CloudflareImageId,
        image.FileName,
        image.ContentType,
        image.SizeBytes,
        image.UploadedAtUtc);
}
