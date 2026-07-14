using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using Turicine.Catalogo.Models.ReadModels;

namespace Turicine.Catalogo.Data;

public static class CatalogEdmModel
{
    public static IEdmModel Build()
    {
        var builder = new ODataConventionModelBuilder();
        builder.EntitySet<MovieReadModel>("Movies");
        builder.EntitySet<VenueReadModel>("Venues");
        builder.EntitySet<CategoryReadModel>("Categories");
        builder.EntitySet<LeadReadModel>("Leads");
        builder.EntitySet<SponsorReadModel>("Sponsors");
        // Keep these as inline complex types despite having an Id property,
        // so they are serialized within each Movie instead of needing their own entity set.
        builder.ComplexType<ImageReadModel>();
        builder.ComplexType<VenueSummaryReadModel>();
        builder.ComplexType<CategorySummaryReadModel>();
        return builder.GetEdmModel();
    }
}
