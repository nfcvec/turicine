namespace Turicine.Catalogo.Contracts.Leads;

public sealed record MarkDownloadedRequest(IReadOnlyList<Guid> Ids);
