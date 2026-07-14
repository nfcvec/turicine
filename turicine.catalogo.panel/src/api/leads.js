import { get, post } from "./client.js";

// Flexible read via OData; newest first.
export function listLeads(signal) {
  return get("odata/Leads?$orderby=CreatedAtUtc desc", { signal });
}

export function listNewLeads(signal) {
  return get("odata/Leads?$filter=IsDownloaded eq false&$orderby=CreatedAtUtc desc", { signal });
}

export function markDownloaded(ids, signal) {
  return post("api/leads/mark-downloaded", { ids }, { signal });
}
