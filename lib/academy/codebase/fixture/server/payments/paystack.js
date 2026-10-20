import { config } from "../config.js";

// Starts a Paystack transaction and returns the page the customer pays on.
// With no secret key (local development) payment is skipped.
export async function initializePayment(order, user) {
  if (!config.paystackSecret) return null;
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.paystackSecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: user.email, amount: order.total, reference: order.id }),
  });
  const result = await response.json();
  if (!result.status) throw new Error(`Paystack: ${result.message}`);
  return result.data.authorization_url;
}
