// Formats a duration in seconds as "1h 21m", "48m" or "" when unknown.
export function formatDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return ''
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.round((totalSeconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
