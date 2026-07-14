// Public sponsors for the footer carousel. Same-origin `/api` (proxy in dev/prod).
export async function fetchSponsors(signal) {
  const response = await fetch('/api/public/sponsors', { signal })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}
