import { get, post, put, del } from "./client.js";

export function listCategories(signal) {
  return get("odata/Categories?$orderby=Name", { signal });
}

export function createCategory(payload, signal) {
  return post("api/categories", payload, { signal });
}

export function updateCategory(id, payload, signal) {
  return put(`api/categories/${id}`, payload, { signal });
}

export function deleteCategory(id, signal) {
  return del(`api/categories/${id}`, { signal });
}
