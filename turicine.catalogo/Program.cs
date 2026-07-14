using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Turicine.Catalogo.Data;
using Turicine.Catalogo.Options;
using Turicine.Catalogo.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is required.");

var keycloakAuthority = builder.Configuration["Keycloak:Authority"]
    ?? throw new InvalidOperationException("Keycloak:Authority is required.");
var keycloakAudience = builder.Configuration["Keycloak:Audience"]
    ?? throw new InvalidOperationException("Keycloak:Audience is required.");

builder.Services
    .AddControllers()
    .AddOData(options => options
        .Select()
        .Filter()
        .OrderBy()
        .Count()
        .Expand()
        .SetMaxTop(200)
        .AddRouteComponents("odata", CatalogEdmModel.Build()));
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// Keycloak (OIDC) bearer authentication. The API is a resource server: it only
// validates access tokens issued by the realm, no client credentials.
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = keycloakAuthority;
        options.Audience = keycloakAudience;
        options.RequireHttpsMetadata = true;
        options.TokenValidationParameters.ValidateAudience = true;
        options.Events = new JwtBearerEvents
        {
            // Keycloak client roles live in resource_access.<client>.roles, which is not
            // the default role claim. Flatten them into role claims so RequireRole works.
            OnTokenValidated = context =>
            {
                if (context.Principal?.Identity is not ClaimsIdentity identity)
                {
                    return Task.CompletedTask;
                }

                var resourceAccess = context.Principal.FindFirst("resource_access")?.Value;
                if (!string.IsNullOrEmpty(resourceAccess))
                {
                    using var document = JsonDocument.Parse(resourceAccess);
                    if (document.RootElement.TryGetProperty(keycloakAudience, out var client) &&
                        client.TryGetProperty("roles", out var roles) &&
                        roles.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var role in roles.EnumerateArray())
                        {
                            var value = role.GetString();
                            if (!string.IsNullOrEmpty(value))
                            {
                                identity.AddClaim(new Claim(ClaimTypes.Role, value));
                            }
                        }
                    }
                }

                return Task.CompletedTask;
            }
        };
    });

// Every endpoint requires an authenticated admin unless it opts out with [AllowAnonymous].
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .RequireRole("admin")
        .Build();
});

builder.Services
    .AddOptions<CloudflareImagesOptions>()
    .Bind(builder.Configuration.GetSection(CloudflareImagesOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddHttpClient(CloudflareImagesOptions.HttpClientName, client =>
{
    client.BaseAddress = new Uri("https://api.cloudflare.com/client/v4/");
});
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IVenueService, VenueService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IPublicCatalogService, PublicCatalogService>();
builder.Services.AddScoped<ILeadService, LeadService>();
builder.Services.AddScoped<ISponsorService, SponsorService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
