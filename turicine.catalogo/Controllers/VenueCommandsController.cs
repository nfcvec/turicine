using Microsoft.AspNetCore.Mvc;
using Turicine.Catalogo.Contracts.Venues;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

[ApiController]
[Route("api/venues")]
public sealed class VenueCommandsController(IVenueService venueService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<VenueResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VenueResponse>> Create(
        [FromBody] CreateVenueRequest request,
        CancellationToken cancellationToken)
    {
        var venue = await venueService.CreateAsync(request, cancellationToken);
        return Created($"odata/Venues({venue.Id})", VenueResponse.FromEntity(venue));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<VenueResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VenueResponse>> Update(
        Guid id,
        [FromBody] UpdateVenueRequest request,
        CancellationToken cancellationToken)
    {
        var venue = await venueService.UpdateAsync(id, request, cancellationToken);
        return venue is null ? NotFound() : Ok(VenueResponse.FromEntity(venue));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await venueService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
