// Public lead capture. Same-origin `/api` (Vite proxy in dev, origin proxy in prod).
export async function submitLead(payload, signal) {
  const response = await fetch('/api/public/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
  if (!response.ok) {
    throw new Error(`No se pudo enviar el formulario (HTTP ${response.status}).`)
  }
}
