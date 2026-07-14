using Microsoft.EntityFrameworkCore;
using Turicine.Catalogo.Contracts.Leads;
using Turicine.Catalogo.Data;
using Turicine.Catalogo.Models.Entities;
using Turicine.Catalogo.Models.ReadModels;

namespace Turicine.Catalogo.Services;

public sealed class LeadService(AppDbContext dbContext) : ILeadService
{
    public async Task<Lead> CreateAsync(CreateLeadRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var lead = new Lead
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            Message = string.IsNullOrWhiteSpace(request.Message) ? null : request.Message.Trim(),
            Topic = string.IsNullOrWhiteSpace(request.Topic) ? null : request.Topic.Trim(),
            CreatedAtUtc = DateTimeOffset.UtcNow,
            IsDownloaded = false
        };

        dbContext.Leads.Add(lead);
        await dbContext.SaveChangesAsync(cancellationToken);
        return lead;
    }

    public async Task<int> MarkDownloadedAsync(IReadOnlyList<Guid> ids, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(ids);
        if (ids.Count == 0)
        {
            return 0;
        }

        var now = DateTimeOffset.UtcNow;
        // Idempotent: marking an already-downloaded lead just refreshes the timestamp.
        return await dbContext.Leads
            .Where(lead => ids.Contains(lead.Id))
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(lead => lead.IsDownloaded, true)
                    .SetProperty(lead => lead.DownloadedAtUtc, now),
                cancellationToken);
    }

    public IQueryable<LeadReadModel> Query() =>
        dbContext.Leads
            .AsNoTracking()
            .Select(lead => new LeadReadModel
            {
                Id = lead.Id,
                FullName = lead.FullName,
                Email = lead.Email,
                Message = lead.Message,
                Topic = lead.Topic,
                CreatedAtUtc = lead.CreatedAtUtc,
                IsDownloaded = lead.IsDownloaded,
                DownloadedAtUtc = lead.DownloadedAtUtc
            });
}
