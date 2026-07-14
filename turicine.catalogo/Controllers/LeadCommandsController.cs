using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Leads;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

[ApiController]
[Route("api/leads")]
public sealed class LeadCommandsController(ILeadService leadService) : ControllerBase
{
    [HttpPost("mark-downloaded")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> MarkDownloaded(
        [FromBody] MarkDownloadedRequest request,
        CancellationToken cancellationToken)
    {
        await leadService.MarkDownloadedAsync(request.Ids ?? [], cancellationToken);
        return NoContent();
    }
}
