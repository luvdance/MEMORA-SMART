import { request } from "./client.js";

export function fetchProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return request(`/api/products${query}`);
}
