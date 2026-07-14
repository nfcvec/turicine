import Keycloak from "keycloak-js";

let keycloak = null;

function readConfig() {
  const c = typeof window !== "undefined" ? window.__APP_CONFIG__ : undefined;
  if (!c?.VITE_KEYCLOAK_URL || !c?.VITE_KEYCLOAK_REALM || !c?.VITE_KEYCLOAK_CLIENT_ID) {
    throw new Error(
      "Runtime config missing Keycloak settings (VITE_KEYCLOAK_URL / VITE_KEYCLOAK_REALM / VITE_KEYCLOAK_CLIENT_ID).",
    );
  }
  return c;
}

// Forces login on first load (onLoad: login-required redirects to Keycloak).
export async function initKeycloak() {
  const c = readConfig();
  keycloak = new Keycloak({
    url: c.VITE_KEYCLOAK_URL,
    realm: c.VITE_KEYCLOAK_REALM,
    clientId: c.VITE_KEYCLOAK_CLIENT_ID,
  });
  await keycloak.init({
    onLoad: "login-required",
    pkceMethod: "S256",
    checkLoginIframe: false,
  });
  return keycloak;
}

// Refreshes the token if it is about to expire; returns a valid access token.
export async function ensureFreshToken() {
  if (!keycloak) return null;
  try {
    await keycloak.updateToken(30);
  } catch {
    keycloak.login();
  }
  return keycloak.token;
}

export function getUsername() {
  return keycloak?.tokenParsed?.preferred_username ?? keycloak?.tokenParsed?.email ?? null;
}

export function logout() {
  keycloak?.logout();
}
