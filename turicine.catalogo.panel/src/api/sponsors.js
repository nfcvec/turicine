import { get, put, del, request } from "./client.js";

export function listSponsors(signal) {
  return get("odata/Sponsors?$orderby=Name", { signal });
}

export function createSponsor(name, file, signal) {
  const form = new FormData();
  form.append("name", name);
  form.append("file", file);
  return request("api/sponsors", { method: "POST", rawBody: form, signal });
}

export function updateSponsorName(id, name, signal) {
  return put(`api/sponsors/${id}`, { name }, { signal });
}

export function replaceSponsorLogo(id, file, signal) {
  const form = new FormData();
  form.append("file", file);
  return request(`api/sponsors/${id}/logo`, { method: "PUT", rawBody: form, signal });
}

export function deleteSponsor(id, signal) {
  return del(`api/sponsors/${id}`, { signal });
}
