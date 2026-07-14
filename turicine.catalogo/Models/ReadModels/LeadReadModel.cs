namespace Turicine.Catalogo.Models.ReadModels;

public sealed class LeadReadModel
{
    public Guid Id { get; init; }

    public string FullName { get; init; } = string.Empty;

    public string Email { get; init; } = string.Empty;

    public string? Message { get; init; }

    public string? Topic { get; init; }

    public DateTimeOffset CreatedAtUtc { get; init; }

    public bool IsDownloaded { get; init; }

    public DateTimeOffset? DownloadedAtUtc { get; init; }
}
