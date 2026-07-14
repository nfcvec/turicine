using Turicine.Catalogo.Contracts.Venues;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Models.ReadModels;

namespace Turicine.Catalogo.Services;

public interface IVenueService
{
    Task<Venue> CreateAsync(CreateVenueRequest request, CancellationToken cancellationToken = default);

    Task<Venue?> UpdateAsync(Guid id, UpdateVenueRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> SetLogoAsync(Guid venueId, Guid imageId, CancellationToken cancellationToken = default);

    Task<bool> RemoveLogoAsync(Guid venueId, CancellationToken cancellationToken = default);

    IQueryable<VenueReadModel> Query();
}
