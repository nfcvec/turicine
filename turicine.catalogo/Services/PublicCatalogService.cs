using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Turicine.Catalogo.Contracts.Public;
using Turicine.Catalogo.Data;
using Turicine.Catalogo.Options;

namespace Turicine.Catalogo.Services;

public sealed class PublicCatalogService(AppDbContext dbContext, IOptions<CloudflareImagesOptions> imagesOptions)
    : IPublicCatalogService
{
    private readonly string _deliveryBaseUrl = imagesOptions.Value.DeliveryBaseUrl.TrimEnd('/');

    public async Task<CatalogResponse> GetCatalogAsync(CancellationToken cancellationToken = default)
    {
        // Materialize the shape first (with raw image ids), then build delivery URLs
        // in memory so the base URL is not part of the SQL translation.
        var categories = await dbContext.Categories
            .AsNoTracking()
            .OrderBy(category => category.Name)
            .Select(category => new
            {
                category.Id,
                category.Name,
                Movies = category.Movies
                    .Where(movie => movie.IsVisible)
                    .OrderBy(movie => movie.Title)
                    .Select(movie => new
                    {
                        movie.Id,
                        movie.Title,
                        movie.Synopsis,
                        movie.DurationSeconds,
                        movie.Directors,
                        movie.Cast,
                        ImageIds = movie.MovieImages
                            .OrderBy(mi => mi.CarouselOrder)
                            .Select(mi => mi.Image!.CloudflareImageId)
                            .ToList(),
                        Venues = movie.Venues
                            .OrderBy(venue => venue.Name)
                            .Select(venue => new
                            {
                                venue.Id,
                                venue.Name,
                                venue.Address,
                                venue.MapsUrl,
                                venue.WhatsappNumber,
                                venue.PhoneNumber,
                                LogoImageId = venue.Logo != null ? venue.Logo.CloudflareImageId : null
                            })
                            .ToList()
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);

        return new CatalogResponse
        {
            Categories = categories
                .Where(category => category.Movies.Count > 0)
                .Select(category => new CatalogCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Movies = category.Movies.Select(movie => new CatalogMovieDto
                {
                    Id = movie.Id,
                    Title = movie.Title,
                    Synopsis = movie.Synopsis,
                    DurationSeconds = movie.DurationSeconds,
                    Directors = movie.Directors,
                    Cast = movie.Cast,
                    Images = movie.ImageIds
                        .Select(imageId => $"{_deliveryBaseUrl}/{imageId}/public")
                        .ToList(),
                    Venues = movie.Venues.Select(venue => new CatalogVenueDto
                    {
                        Id = venue.Id,
                        Name = venue.Name,
                        Address = venue.Address,
                        MapsUrl = venue.MapsUrl,
                        WhatsappNumber = venue.WhatsappNumber,
                        PhoneNumber = venue.PhoneNumber,
                        LogoUrl = venue.LogoImageId == null
                            ? null
                            : $"{_deliveryBaseUrl}/{venue.LogoImageId}/public"
                    }).ToList()
                }).ToList()
            }).ToList()
        };
    }
}
