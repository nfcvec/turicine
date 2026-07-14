using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Public;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

// Public sponsors for the landing footer carousel. Anonymous overrides the admin policy.
[ApiController]
[AllowAnonymous]
[Route("api/public/sponsors")]
public sealed class PublicSponsorsController(ISponsorService sponsorService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<PublicSponsorDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PublicSponsorDto>>> Get(CancellationToken cancellationToken)
    {
        var sponsors = await sponsorService.GetPublicAsync(cancellationToken);
        return Ok(sponsors);
    }
}
