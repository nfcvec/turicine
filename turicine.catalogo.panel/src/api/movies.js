import { get, post, put, del, request } from "./client.js";

// Flexible reads go through OData; commands go through the explicit REST endpoints.
export function listMovies(signal) {
  return get("odata/Movies?$orderby=Category/Name,Title", { signal });
}

export function getMovie(id, signal) {
  return get(`odata/Movies(${id})`, { signal });
}

export function createMovie(payload, signal) {
  return post("api/movies", payload, { signal });
}

export function updateMovie(id, payload, signal) {
  return put(`api/movies/${id}`, payload, { signal });
}

export function deleteMovie(id, signal) {
  return del(`api/movies/${id}`, { signal });
}

export function setMovieVisibility(id, isVisible, signal) {
  return put(`api/movies/${id}/visibility`, { isVisible }, { signal });
}

export function deleteMovieImage(movieId, imageId, signal) {
  return del(`api/movies/${movieId}/images/${imageId}`, { signal });
}

export function reorderMovieImages(movieId, imageIds, signal) {
  return put(`api/movies/${movieId}/images/order`, { imageIds }, { signal });
}

export function uploadMovieImage(movieId, file, carouselOrder, signal) {
  const form = new FormData();
  form.append("file", file);
  form.append("carouselOrder", String(carouselOrder));
  // Let the browser set the multipart boundary; do not send a JSON body.
  return request(`api/movies/${movieId}/images`, {
    method: "POST",
    rawBody: form,
    signal,
  });
}
