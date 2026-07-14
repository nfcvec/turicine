using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Turicine.Catalogo.Models.ReadModels;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

// Admin read of captured leads (secured by the global FallbackPolicy).
public sealed class LeadsController(ILeadService leadService) : ODataController
{
    [EnableQuery(MaxTop = 5000, PageSize = 1000)]
    public IQueryable<LeadReadModel> Get() => leadService.Query();

    [EnableQuery]
    public SingleResult<LeadReadModel> Get(Guid key) =>
        SingleResult.Create(leadService.Query().Where(lead => lead.Id == key));
}
