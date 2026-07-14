using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Turicine.Catalogo.Contracts.Public;
using Turicine.Catalogo.Data;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Models.ReadModels;
using Turicine.Catalogo.Options;

namespace Turicine.Catalogo.Services;

public sealed class SponsorService(
    AppDbContext dbContext,
    IImageService imageService,
    IOptions<CloudflareImagesOptions> imagesOptions) : ISponsorService
{
    private readonly string _deliveryBaseUrl = imagesOptions.Value.DeliveryBaseUrl.TrimEnd('/');

    public async Task<Sponsor> CreateAsync(string name, Guid logoImageId, CancellationToken cancellationToken = default)
    {
        var sponsor = new Sponsor
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            LogoImageId = logoImageId
        };

        dbContext.Sponsors.Add(sponsor);
        await dbContext.SaveChangesAsync(cancellationToken);
        return sponsor;
    }

    public async Task<Sponsor?> UpdateNameAsync(Guid id, string name, CancellationToken cancellationToken = default)
    {
        var sponsor = await dbContext.Sponsors.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (sponsor is null)
        {
            return null;
        }

        sponsor.Name = name.Trim();
        await dbContext.SaveChangesAsync(cancellationToken);
        return sponsor;
    }

    public async Task<bool> ReplaceLogoAsync(Guid id, Guid newImageId, CancellationToken cancellationToken = default)
    {
        var sponsor = await dbContext.Sponsors.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (sponsor is null)
        {
            return false;
        }

        var previous = sponsor.LogoImageId;
        sponsor.LogoImageId = newImageId;
        await dbContext.SaveChangesAsync(cancellationToken);

        if (previous != newImageId)
        {
            await imageService.DeleteAsync(previous, cancellationToken);
        }

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var sponsor = await dbContext.Sponsors.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (sponsor is null)
        {
            return false;
        }

        var logoImageId = sponsor.LogoImageId;
        dbContext.Sponsors.Remove(sponsor);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Single-owner asset: remove the logo (row + Cloudflare) after unlinking.
        await imageService.DeleteAsync(logoImageId, cancellationToken);
        return true;
    }

    public IQueryable<SponsorReadModel> Query() =>
        dbContext.Sponsors
            .AsNoTracking()
            .Select(sponsor => new SponsorReadModel
            {
                Id = sponsor.Id,
                Name = sponsor.Name,
                LogoImageId = sponsor.LogoImageId,
                LogoCloudflareImageId = sponsor.Logo != null ? sponsor.Logo.CloudflareImageId : null
            });

    public async Task<IReadOnlyList<PublicSponsorDto>> GetPublicAsync(CancellationToken cancellationToken = default)
    {
        var rows = await dbContext.Sponsors
            .AsNoTracking()
            .OrderBy(sponsor => sponsor.Name)
            .Select(sponsor => new
            {
                sponsor.Name,
                CloudflareImageId = sponsor.Logo != null ? sponsor.Logo.CloudflareImageId : null
            })
            .ToListAsync(cancellationToken);

        return rows
            .Where(row => row.CloudflareImageId != null)
            .Select(row => new PublicSponsorDto
            {
                Name = row.Name,
                LogoUrl = $"{_deliveryBaseUrl}/{row.CloudflareImageId}/public"
            })
            .ToList();
    }
}
