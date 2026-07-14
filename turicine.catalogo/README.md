# Turicine.Catalogo

Web API para cargar imágenes en Cloudflare Images y persistir sus referencias en PostgreSQL.

## Configuración

Copia `appsettings.example.json` como `appsettings.json` o define estas variables de entorno:

- `ConnectionStrings__DefaultConnection`
- `CloudflareImages__AccountId`
- `CloudflareImages__ApiToken` (token con permiso `Images Write`)

## Carga

Envía `POST /api/images` como `multipart/form-data` con un campo `file`. El tamaño máximo es 10 MB.

```bash
curl -X POST http://localhost:5000/api/images \
  -F "file=@poster.jpg"
```

Aplica la migración antes de iniciar el API:

```bash
dotnet ef database update --project turicine.catalogo
```
