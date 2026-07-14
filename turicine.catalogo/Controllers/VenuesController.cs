using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Turicine.Catalogo.Models.ReadModels;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

public sealed class VenuesController(IVenueService venueService) : ODataController
{
    [EnableQuery(MaxTop = 500, PageSize = 200)]
    public IQueryable<VenueReadModel> Get() => venueService.Query();

    [EnableQuery]
    public SingleResult<VenueReadModel> Get(Guid key) =>
        SingleResult.Create(venueService.Query().Where(venue => venue.Id == key));
}
