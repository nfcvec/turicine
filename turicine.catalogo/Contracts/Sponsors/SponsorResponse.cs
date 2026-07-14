using Turicine.Catalogo.Models.Entities;

namespace Turicine.Catalogo.Contracts.Sponsors;

public sealed record SponsorResponse(
    Guid Id,
    string Name,
    Guid LogoImageId)
{
    public static SponsorResponse FromEntity(Sponsor sponsor) => new(
        sponsor.Id,
        sponsor.Name,
        sponsor.LogoImageId);
}
