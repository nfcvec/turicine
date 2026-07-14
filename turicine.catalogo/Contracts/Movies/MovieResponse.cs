using Turicine.Catalogo.Models.Entities;

namespace Turicine.Catalogo.Contracts.Movies;

public sealed record MovieResponse(
    Guid Id,
    string Title,
    string? Synopsis,
    Guid CategoryId,
    int DurationSeconds,
    bool IsVisible,
    string? Directors,
    string? Cast)
{
    public static MovieResponse FromEntity(Movie movie) => new(
        movie.Id,
        movie.Title,
        movie.Synopsis,
        movie.CategoryId,
        movie.DurationSeconds,
        movie.IsVisible,
        movie.Directors,
        movie.Cast);
}
