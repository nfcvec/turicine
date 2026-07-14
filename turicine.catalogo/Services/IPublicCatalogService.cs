using Turicine.Catalogo.Contracts.Public;

namespace Turicine.Catalogo.Services;

public interface IPublicCatalogService
{
    Task<CatalogResponse> GetCatalogAsync(CancellationToken cancellationToken = default);
}
