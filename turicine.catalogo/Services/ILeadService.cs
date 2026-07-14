using Turicine.Catalogo.Contracts.Leads;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Models.ReadModels;

namespace Turicine.Catalogo.Services;

public interface ILeadService
{
    Task<Lead> CreateAsync(CreateLeadRequest request, CancellationToken cancellationToken = default);

    Task<int> MarkDownloadedAsync(IReadOnlyList<Guid> ids, CancellationToken cancellationToken = default);

    IQueryable<LeadReadModel> Query();
}
