import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { config } from "../config.js";
import { hashPassword } from "../services/authService.js";

// Demo accounts for local development only.
const accounts = [
  { id: "u_1001", name: "Bola Ade", email: "bola@kobo.test", role: "customer", salt: "4f1c9a", password: "market-day-2026" },
  { id: "u_1002", name: "Kemi Lawal", email: "admin@kobo.test", role: "admin", salt: "9b2e71", password: "admin-only-2026" },
];

const products = [
  { id: "tecno-spark-30", name: "Tecno Spark 30", category: "phones", price: 21950000 },
  { id: "infinix-hot-50", name: "Infinix Hot 50", category: "phones", price: 18900000 },
  { id: "ankara-tote", name: "Ankara tote bag", category: "fashion", price: 1250000 },
  { id: "aso-oke-cap", name: "Aso-oke cap", category: "fashion", price: 850000 },
  { id: "rechargeable-fan", name: "Rechargeable standing fan", category: "home", price: 4700000 },
  { id: "solar-lamp", name: "Solar lamp", category: "home", price: 1590000 },
];

const users = accounts.map((account) => ({
  id: account.id,
  name: account.name,
  email: account.email,
  role: account.role,
  salt: account.salt,
  passwordHash: hashPassword(account.password, account.salt),
}));

await mkdir(dirname(config.dataFile), { recursive: true });
await writeFile(config.dataFile, JSON.stringify({ users, products, orders: [] }, null, 2));
console.log(`Seeded ${users.length} users and ${products.length} products into ${config.dataFile}`);
