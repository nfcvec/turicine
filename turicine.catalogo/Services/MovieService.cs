using Microsoft.EntityFrameworkCore;
using Turicine.Catalogo.Contracts.Movies;
using Turicine.Catalogo.Data;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Models.ReadModels;

namespace Turicine.Catalogo.Services;

public sealed class MovieService(AppDbContext dbContext, IImageService imageService) : IMovieService
{
    public async Task<Movie> CreateAsync(CreateMovieRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Synopsis = string.IsNullOrWhiteSpace(request.Synopsis) ? null : request.Synopsis.Trim(),
            CategoryId = request.CategoryId,
            DurationSeconds = request.DurationSeconds,
            IsVisible = request.IsVisible ?? true,
            Directors = string.IsNullOrWhiteSpace(request.Directors) ? null : request.Directors.Trim(),
            Cast = string.IsNullOrWhiteSpace(request.Cast) ? null : request.Cast.Trim()
        };

        dbContext.Movies.Add(movie);
        await dbContext.SaveChangesAsync(cancellationToken);

        return movie;
    }

    public async Task<Movie?> UpdateAsync(Guid id, UpdateMovieRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var movie = await dbContext.Movies.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
        if (movie is null)
        {
            return null;
        }

        movie.Title = request.Title.Trim();
        movie.Synopsis = string.IsNullOrWhiteSpace(request.Synopsis) ? null : request.Synopsis.Trim();
        movie.CategoryId = request.CategoryId;
        movie.DurationSeconds = request.DurationSeconds;
        movie.IsVisible = request.IsVisible ?? true;
        movie.Directors = string.IsNullOrWhiteSpace(request.Directors) ? null : request.Directors.Trim();
        movie.Cast = string.IsNullOrWhiteSpace(request.Cast) ? null : request.Cast.Trim();

        await dbContext.SaveChangesAsync(cancellationToken);
        return movie;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var movie = await dbContext.Movies
            .Include(m => m.MovieImages)
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
        if (movie is null)
        {
            return false;
        }

        var imageIds = movie.MovieImages.Select(mi => mi.ImageId).ToList();

        dbContext.MovieImages.RemoveRange(movie.MovieImages);
        dbContext.Movies.Remove(movie);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Single-owner assets: remove each image (row + Cloudflare) after unlinking.
        foreach (var imageId in imageIds)
        {
            await imageService.DeleteAsync(imageId, cancellationToken);
        }

        return true;
    }

    public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default) =>
        dbContext.Movies.AnyAsync(movie => movie.Id == id, cancellationToken);

    public async Task<bool> SetVisibilityAsync(Guid id, bool isVisible, CancellationToken cancellationToken = default)
    {
        var updated = await dbContext.Movies
            .Where(movie => movie.Id == id)
            .ExecuteUpdateAsync(setters => setters.SetProperty(movie => movie.IsVisible, isVisible), cancellationToken);
        return updated > 0;
    }

    public async Task<bool> AttachImageAsync(Guid movieId, Guid imageId, CancellationToken cancellationToken = default)
    {
        if (!await dbContext.Movies.AnyAsync(m => m.Id == movieId, cancellationToken))
        {
            return false;
        }

        var nextOrder = await dbContext.MovieImages
            .Where(mi => mi.MovieId == movieId)
            .CountAsync(cancellationToken);

        dbContext.MovieImages.Add(new MovieImage
        {
            Id = Guid.NewGuid(),
            MovieId = movieId,
            ImageId = imageId,
            CarouselOrder = nextOrder
        });
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> RemoveImageAsync(Guid movieId, Guid imageId, CancellationToken cancellationToken = default)
    {
        var link = await dbContext.MovieImages
            .FirstOrDefaultAsync(mi => mi.MovieId == movieId && mi.ImageId == imageId, cancellationToken);
        if (link is null)
        {
            return false;
        }

        dbContext.MovieImages.Remove(link);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Single-owner: the asset belonged to this movie only.
        await imageService.DeleteAsync(imageId, cancellationToken);
        return true;
    }

    public async Task<bool> ReorderImagesAsync(Guid movieId, IReadOnlyList<Guid> imageIds, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(imageIds);

        var links = await dbContext.MovieImages
            .Where(mi => mi.MovieId == movieId)
            .ToListAsync(cancellationToken);

        if (imageIds.Count != links.Count || imageIds.Distinct().Count() != imageIds.Count)
        {
            return false;
        }

        var byImageId = links.ToDictionary(mi => mi.ImageId);
        for (var order = 0; order < imageIds.Count; order++)
        {
            if (!byImageId.TryGetValue(imageIds[order], out var link))
            {
                return false;
            }
            link.CarouselOrder = order;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> SetVenuesAsync(Guid movieId, IReadOnlyList<Guid> venueIds, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(venueIds);

        var movie = await dbContext.Movies
            .Include(m => m.Venues)
            .FirstOrDefaultAsync(m => m.Id == movieId, cancellationToken);
        if (movie is null)
        {
            return false;
        }

        var ids = venueIds.Distinct().ToList();
        var venues = await dbContext.Venues.Where(v => ids.Contains(v.Id)).ToListAsync(cancellationToken);
        if (venues.Count != ids.Count)
        {
            return false; // some venue id does not exist
        }

        movie.Venues.Clear();
        foreach (var venue in venues)
        {
            movie.Venues.Add(venue);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public IQueryable<MovieReadModel> Query() =>
        dbContext.Movies
            .AsNoTracking()
            .Select(movie => new MovieReadModel
            {
                Id = movie.Id,
                Title = movie.Title,
                Synopsis = movie.Synopsis,
                IsVisible = movie.IsVisible,
                CategoryId = movie.CategoryId,
                Category = movie.Category == null ? null : new CategorySummaryReadModel
                {
                    Id = movie.Category.Id,
                    Name = movie.Category.Name
                },
                DurationSeconds = movie.DurationSeconds,
                Directors = movie.Directors,
                Cast = movie.Cast,
                Images = movie.MovieImages
                    .OrderBy(mi => mi.CarouselOrder)
                    .Select(mi => new ImageReadModel
                    {
                        Id = mi.ImageId,
                        CloudflareImageId = mi.Image!.CloudflareImageId,
                        CarouselOrder = mi.CarouselOrder
                    })
                    .ToList(),
                Venues = movie.Venues
                    .OrderBy(venue => venue.Name)
                    .Select(venue => new VenueSummaryReadModel
                    {
                        Id = venue.Id,
                        Name = venue.Name,
                        Address = venue.Address,
                        MapsUrl = venue.MapsUrl,
                        WhatsappNumber = venue.WhatsappNumber,
                        PhoneNumber = venue.PhoneNumber,
                        LogoImageId = venue.LogoImageId,
                        LogoCloudflareImageId = venue.Logo != null ? venue.Logo.CloudflareImageId : null
                    })
                    .ToList()
            });
}
