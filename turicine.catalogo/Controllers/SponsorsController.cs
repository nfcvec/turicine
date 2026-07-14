using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Turicine.Catalogo.Models.ReadModels;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

public sealed class SponsorsController(ISponsorService sponsorService) : ODataController
{
    [EnableQuery(MaxTop = 500, PageSize = 200)]
    public IQueryable<SponsorReadModel> Get() => sponsorService.Query();

    [EnableQuery]
    public SingleResult<SponsorReadModel> Get(Guid key) =>
        SingleResult.Create(sponsorService.Query().Where(sponsor => sponsor.Id == key));
}
