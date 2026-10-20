// FIXME: old checkout from the first prototype. Is anything still using this?
export default function OldCheckout({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <section>
      <h2>Checkout</h2>
      <p>Total: ₦{total / 100}</p>
      <button disabled>Pay on delivery</button>
    </section>
  );
}
