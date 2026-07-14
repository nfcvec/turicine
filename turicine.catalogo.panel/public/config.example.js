// Runtime configuration template. Copy this file to public/config.js and set
// the real values per environment. public/config.js is git-ignored and is NOT
// baked into the bundle: the same build runs in local, stage and production,
// only config.js changes.
//
// In formal deployment, entrypoint.sh generates config.js from container env vars.
window.__APP_CONFIG__ = {
  // Base URL of the Turicine.Catalogo backend (no trailing slash).
  //   ""                       -> same-origin: /api and /odata served by the same
  //                               site (production) or proxied by Vite (dev). No CORS.
  //   "https://api.host.tld"   -> absolute: cross-origin, backend must allow CORS.
  VITE_API_BASE_URL: "",

  // Cloudflare Images delivery base, account-specific hash, no trailing slash.
  // Image URL = `${VITE_IMAGES_BASE_URL}/${cloudflareImageId}/${variant}`.
  VITE_IMAGES_BASE_URL: "https://imagedelivery.net/<account-hash>",

  // Keycloak SSO. Public client with PKCE, no secret.
  VITE_KEYCLOAK_URL: "https://<keycloak-host>",
  VITE_KEYCLOAK_REALM: "druk",
  VITE_KEYCLOAK_CLIENT_ID: "turicine-web",
};
