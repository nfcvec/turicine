using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Leads;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

// Public lead capture from the landing forms. Anonymous overrides the admin FallbackPolicy.
[ApiController]
[AllowAnonymous]
[Route("api/public/leads")]
public sealed class PublicLeadsController(ILeadService leadService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateLeadRequest request,
        CancellationToken cancellationToken)
    {
        var lead = await leadService.CreateAsync(request, cancellationToken);
        // Do not leak the stored row to anonymous callers; a bare 201 is enough.
        return Created($"odata/Leads({lead.Id})", null);
    }
}
