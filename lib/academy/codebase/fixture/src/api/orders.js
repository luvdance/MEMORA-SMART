import { request } from "./client.js";

export function placeOrder(items, token) {
  return request("/api/orders", {
    method: "POST",
    body: { items: items.map(({ id, quantity }) => ({ id, quantity })) },
    token,
  });
}
