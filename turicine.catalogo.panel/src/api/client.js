// Central HTTP client. All backend calls go through here.
// Base URL is resolved at runtime from public/config.js (window.__APP_CONFIG__),
// never hardcoded or baked into the bundle.
import { ensureFreshToken } from "../auth/keycloak.js";

function resolveApiBaseUrl() {
  const config = typeof window !== "undefined" ? window.__APP_CONFIG__ : undefined;
  const baseUrl = config ? config.VITE_API_BASE_URL : undefined;

  // Undefined/null means the runtime config was not loaded at all -> fail clearly.
  // An empty string is a valid, explicit choice: same-origin (paths like /api are
  // served by the same site, or proxied by Vite in dev), so no base prefix.
  if (baseUrl === undefined || baseUrl === null) {
    throw new Error(
      "Runtime config missing: window.__APP_CONFIG__.VITE_API_BASE_URL. " +
        "Copy public/config.example.js to public/config.js and set the backend URL " +
        '(use "" for same-origin / Vite proxy).',
    );
  }

  return String(baseUrl).replace(/\/+$/, "");
}

function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalized = String(path).replace(/^\/+/, "");
  return `${resolveApiBaseUrl()}/${normalized}`;
}

export class ApiError extends Error {
  constructor(status, message, detail) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

async function parseBody(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();
  if (!text) {
    return null;
  }
  if (contentType.includes("application/json") || contentType.includes("+json")) {
    return JSON.parse(text);
  }
  return text;
}

export async function request(path, { method = "GET", body, rawBody, signal, headers } = {}) {
  const init = { method, headers: { ...headers }, signal };

  // Every request carries the Keycloak bearer token.
  const token = await ensureFreshToken();
  if (token) {
    init.headers.Authorization = `Bearer ${token}`;
  }

  if (rawBody !== undefined && rawBody !== null) {
    // e.g. FormData: let the browser set Content-Type (multipart boundary).
    init.body = rawBody;
  } else if (body !== undefined && body !== null) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(buildUrl(path), init);
  } catch (cause) {
    // A cancelled request (e.g. component unmount / StrictMode double-invoke)
    // must propagate as AbortError so callers can ignore it, not surface as a
    // "backend unreachable" error.
    if (cause?.name === "AbortError") {
      throw cause;
    }
    throw new ApiError(0, "No se pudo contactar al backend.", cause?.message);
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    const message =
      (payload && (payload.title || payload.detail || payload.message)) ||
      `Error ${response.status}`;
    throw new ApiError(response.status, message, payload);
  }

  return payload;
}

export const get = (path, options) => request(path, { ...options, method: "GET" });
export const post = (path, body, options) => request(path, { ...options, method: "POST", body });
export const put = (path, body, options) => request(path, { ...options, method: "PUT", body });
export const patch = (path, body, options) => request(path, { ...options, method: "PATCH", body });
export const del = (path, options) => request(path, { ...options, method: "DELETE" });
