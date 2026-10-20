import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { config } from "../config.js";

// The data store is one JSON file, loaded on first use and kept in memory.
// Run `npm run seed` to create it.
let data;

async function load() {
  if (!data) data = JSON.parse(await readFile(config.dataFile, "utf8"));
  return data;
}

export async function findUserByEmail(email) {
  const { users } = await load();
  return users.find((user) => user.email === email) || null;
}

export async function findUserById(id) {
  const { users } = await load();
  return users.find((user) => user.id === id) || null;
}

export async function listProducts({ category } = {}) {
  const { products } = await load();
  return category ? products.filter((product) => product.category === category) : products;
}

export async function findProduct(id) {
  const { products } = await load();
  return products.find((product) => product.id === id) || null;
}

export async function saveOrder(order) {
  const store = await load();
  store.orders.push(order);
  await mkdir(dirname(config.dataFile), { recursive: true });
  await writeFile(config.dataFile, JSON.stringify(store, null, 2));
  return order;
}
