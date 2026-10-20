import { sendJson } from "../http.js";
import * as db from "../db/index.js";

export async function listProducts(req, res) {
  const category = new URL(req.url, "http://localhost").searchParams.get("category");
  sendJson(res, 200, { products: await db.listProducts({ category }) });
}

export async function getProduct(req, res, id) {
  const product = await db.findProduct(id);
  if (!product) return sendJson(res, 404, { error: "Product not found" });
  sendJson(res, 200, { product });
}
