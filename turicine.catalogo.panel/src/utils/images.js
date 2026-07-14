// Builds a Cloudflare Images delivery URL from a stored image id.
// Base (account-specific hash) comes from runtime config, never hardcoded.
export function buildImageUrl(cloudflareImageId, variant = "public") {
  const config = typeof window !== "undefined" ? window.__APP_CONFIG__ : undefined;
  const base = config ? config.VITE_IMAGES_BASE_URL : undefined;

  if (!base) {
    throw new Error(
      "Runtime config missing: window.__APP_CONFIG__.VITE_IMAGES_BASE_URL.",
    );
  }

  return `${String(base).replace(/\/+$/, "")}/${cloudflareImageId}/${variant}`;
}
