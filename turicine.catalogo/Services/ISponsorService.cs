using Turicine.Catalogo.Contracts.Public;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Models.ReadModels;

namespace Turicine.Catalogo.Services;

public interface ISponsorService
{
    Task<Sponsor> CreateAsync(string name, Guid logoImageId, CancellationToken cancellationToken = default);

    Task<Sponsor?> UpdateNameAsync(Guid id, string name, CancellationToken cancellationToken = default);

    // Points the sponsor at a new logo image and deletes the previous asset.
    Task<bool> ReplaceLogoAsync(Guid id, Guid newImageId, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    IQueryable<SponsorReadModel> Query();

    Task<IReadOnlyList<PublicSponsorDto>> GetPublicAsync(CancellationToken cancellationToken = default);
}
