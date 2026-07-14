# Stage 1: Build (build context = turicine.catalogo)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# dotnet-ef for the migrations bundle
RUN dotnet tool install --global dotnet-ef --version 10.0.9
ENV PATH="$PATH:/root/.dotnet/tools"

# Restore first (layer cache)
COPY Turicine.Catalogo.csproj ./
RUN dotnet restore Turicine.Catalogo.csproj

# Copy source and publish
COPY . ./
RUN dotnet publish Turicine.Catalogo.csproj -c Release -o /app/publish /p:UseAppHost=false

# Generate migrations bundle. Dummy config satisfies the host-building code
# (Program throws without Keycloak/Cloudflare settings); the bundle itself does
# not connect at build time.
RUN ConnectionStrings__DefaultConnection="Host=localhost;Database=dummy" \
    Keycloak__Authority="https://dummy/realms/dummy" \
    Keycloak__Audience="dummy" \
    CloudflareImages__AccountId="dummy" \
    CloudflareImages__ApiToken="dummy" \
    CloudflareImages__DeliveryBaseUrl="https://dummy" \
    dotnet ef migrations bundle -o /app/publish/efbundle \
    --project Turicine.Catalogo.csproj --configuration Release

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Npgsql Kerberos dependency (silences GSSAPI warnings)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgssapi-krb5-2 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Turicine.Catalogo.dll"]
