using Microsoft.EntityFrameworkCore;
using Turicine.Catalogo.Contracts.Venues;
using Turicine.Catalogo.Data;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Models.ReadModels;

namespace Turicine.Catalogo.Services;

public sealed class VenueService(AppDbContext dbContext, IImageService imageService) : IVenueService
{
    public async Task<Venue> CreateAsync(CreateVenueRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var venue = new Venue { Id = Guid.NewGuid() };
        Apply(venue, request.Name, request.Address, request.MapsUrl, request.WhatsappNumber, request.PhoneNumber);

        dbContext.Venues.Add(venue);
        await dbContext.SaveChangesAsync(cancellationToken);
        return venue;
    }

    public async Task<Venue?> UpdateAsync(Guid id, UpdateVenueRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var venue = await dbContext.Venues.FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
        if (venue is null)
        {
            return null;
        }

        Apply(venue, request.Name, request.Address, request.MapsUrl, request.WhatsappNumber, request.PhoneNumber);
        await dbContext.SaveChangesAsync(cancellationToken);
        return venue;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var venue = await dbContext.Venues.FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
        if (venue is null)
        {
            return false;
        }

        var logoImageId = venue.LogoImageId;

        // The MovieVenue join rows cascade automatically on the FK.
        dbContext.Venues.Remove(venue);
        await dbContext.SaveChangesAsync(cancellationToken);

        if (logoImageId is not null)
        {
            await imageService.DeleteAsync(logoImageId.Value, cancellationToken);
        }

        return true;
    }

    public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default) =>
        dbContext.Venues.AnyAsync(v => v.Id == id, cancellationToken);

    public async Task<bool> SetLogoAsync(Guid venueId, Guid imageId, CancellationToken cancellationToken = default)
    {
        var venue = await dbContext.Venues.FirstOrDefaultAsync(v => v.Id == venueId, cancellationToken);
        if (venue is null)
        {
            return false;
        }

        var previous = venue.LogoImageId;
        venue.LogoImageId = imageId;
        await dbContext.SaveChangesAsync(cancellationToken);

        if (previous is not null && previous != imageId)
        {
            await imageService.DeleteAsync(previous.Value, cancellationToken);
        }

        return true;
    }

    public async Task<bool> RemoveLogoAsync(Guid venueId, CancellationToken cancellationToken = default)
    {
        var venue = await dbContext.Venues.FirstOrDefaultAsync(v => v.Id == venueId, cancellationToken);
        if (venue is null)
        {
            return false;
        }

        var previous = venue.LogoImageId;
        if (previous is null)
        {
            return true;
        }

        venue.LogoImageId = null;
        await dbContext.SaveChangesAsync(cancellationToken);
        await imageService.DeleteAsync(previous.Value, cancellationToken);
        return true;
    }

    public IQueryable<VenueReadModel> Query() =>
        dbContext.Venues
            .AsNoTracking()
            .Select(venue => new VenueReadModel
            {
                Id = venue.Id,
                Name = venue.Name,
                Address = venue.Address,
                MapsUrl = venue.MapsUrl,
                WhatsappNumber = venue.WhatsappNumber,
                PhoneNumber = venue.PhoneNumber,
                LogoImageId = venue.LogoImageId,
                LogoCloudflareImageId = venue.Logo != null ? venue.Logo.CloudflareImageId : null
            });

    private static void Apply(Venue venue, string name, string? address, string? mapsUrl, string? whatsappNumber, string? phoneNumber)
    {
        venue.Name = name.Trim();
        venue.Address = Clean(address);
        venue.MapsUrl = Clean(mapsUrl);
        venue.WhatsappNumber = Clean(whatsappNumber);
        venue.PhoneNumber = Clean(phoneNumber);
    }

    private static string? Clean(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
