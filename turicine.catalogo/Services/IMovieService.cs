using Turicine.Catalogo.Contracts.Movies;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Models.ReadModels;

namespace Turicine.Catalogo.Services;

public interface IMovieService
{
    Task<Movie> CreateAsync(CreateMovieRequest request, CancellationToken cancellationToken = default);

    Task<Movie?> UpdateAsync(Guid id, UpdateMovieRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> SetVisibilityAsync(Guid id, bool isVisible, CancellationToken cancellationToken = default);

    Task<bool> AttachImageAsync(Guid movieId, Guid imageId, CancellationToken cancellationToken = default);

    Task<bool> RemoveImageAsync(Guid movieId, Guid imageId, CancellationToken cancellationToken = default);

    Task<bool> ReorderImagesAsync(Guid movieId, IReadOnlyList<Guid> imageIds, CancellationToken cancellationToken = default);

    Task<bool> SetVenuesAsync(Guid movieId, IReadOnlyList<Guid> venueIds, CancellationToken cancellationToken = default);

    IQueryable<MovieReadModel> Query();
}
