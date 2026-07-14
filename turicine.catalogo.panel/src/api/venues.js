import { get, post, put, del, request } from "./client.js";

export function listVenues(signal) {
  return get("odata/Venues?$orderby=Name", { signal });
}

export function createVenue(payload, signal) {
  return post("api/venues", payload, { signal });
}

export function updateVenue(id, payload, signal) {
  return put(`api/venues/${id}`, payload, { signal });
}

export function deleteVenue(id, signal) {
  return del(`api/venues/${id}`, { signal });
}

export function setMovieVenues(movieId, venueIds, signal) {
  return put(`api/movies/${movieId}/venues`, { venueIds }, { signal });
}

export function setVenueLogo(venueId, file, signal) {
  const form = new FormData();
  form.append("file", file);
  return request(`api/venues/${venueId}/logo`, { method: "PUT", rawBody: form, signal });
}

export function deleteVenueLogo(venueId, signal) {
  return del(`api/venues/${venueId}/logo`, { signal });
}
