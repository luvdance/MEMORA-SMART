import { useState } from "react";
import { formatPrice } from "../utils/formatPrice.js";
import { placeOrder } from "../api/orders.js";

const DELIVERY_FEE = 150000; // ₦1,500

export default function Cart({ items, token }) {
  const [status, setStatus] = useState("");
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  async function checkout() {
    try {
      const { order, paymentUrl } = await placeOrder(items, token);
      setStatus(`Order ${order.id} created`);
      if (paymentUrl) window.location.href = paymentUrl;
    } catch (err) {
      setStatus(err.message);
    }
  }

  if (!items.length) return <p>Your cart is empty.</p>;

  return (
    <section>
      <h1>Your cart</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name}: {formatPrice(item.price)}
          </li>
        ))}
      </ul>
      <p>Delivery: {formatPrice(DELIVERY_FEE)}</p>
      <p>
        <strong>Total: {formatPrice(total)}</strong>
      </p>
      <button onClick={checkout}>Checkout</button>
      {status && <p role="status">{status}</p>}
    </section>
  );
}
