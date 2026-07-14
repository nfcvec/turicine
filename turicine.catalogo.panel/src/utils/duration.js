// Duration is stored in the backend as seconds. The UI parses/formats it.

// "1h21m0s" | "7m30s" | "450" -> seconds. Returns null if unparseable.
export function parseDurationToSeconds(input) {
  const value = String(input || "").trim();
  if (value === "") return null;

  if (/^\d+$/.test(value)) return Number(value);

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!match || (!match[1] && !match[2] && !match[3])) return null;

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

// seconds -> "1h21m0s" (compact, no spaces) for the editable duration field.
export function formatSecondsCompact(totalSeconds) {
  const total = Number(totalSeconds) || 0;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${hours}h${minutes}m${seconds}s`;
}

// seconds -> "1h 21m 00s" (human readable).
export function formatSeconds(totalSeconds) {
  const total = Number(totalSeconds) || 0;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${hours > 0 ? String(minutes).padStart(2, "0") : minutes}m`);
  parts.push(`${String(seconds).padStart(2, "0")}s`);
  return parts.join(" ");
}
