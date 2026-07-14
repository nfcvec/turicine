using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Public;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

// Public BFF for the landing site. Anonymous overrides the admin FallbackPolicy.
[ApiController]
[AllowAnonymous]
[Route("api/public/catalog")]
public sealed class PublicCatalogController(IPublicCatalogService catalogService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<CatalogResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<CatalogResponse>> Get(CancellationToken cancellationToken)
    {
        var catalog = await catalogService.GetCatalogAsync(cancellationToken);
        return Ok(catalog);
    }
}
