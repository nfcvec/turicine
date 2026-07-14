// Public catalog BFF. Same-origin `/api` (Vite proxy in dev, origin proxy in prod).
export async function fetchCatalog(signal) {
  const response = await fetch('/api/public/catalog', { signal })
  if (!response.ok) {
    throw new Error(`No se pudo cargar el catálogo (HTTP ${response.status}).`)
  }
  return response.json()
}
