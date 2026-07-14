using Turicine.Catalogo.Models.Entities;

namespace Turicine.Catalogo.Services;

// Generic image asset service: uploads to Cloudflare and stores the asset row.
// It does not know which business object references the asset.
public interface IImageService
{
    Task<Image> SaveAsync(
        Stream content,
        string fileName,
        string contentType,
        long sizeBytes,
        CancellationToken cancellationToken = default);

    // Deletes the asset row and then removes it from Cloudflare (best-effort).
    Task<bool> DeleteAsync(Guid imageId, CancellationToken cancellationToken = default);

    // Best-effort removal from Cloudflare only (no DB).
    Task DeleteFromCloudflareAsync(string cloudflareImageId, CancellationToken cancellationToken = default);
}
