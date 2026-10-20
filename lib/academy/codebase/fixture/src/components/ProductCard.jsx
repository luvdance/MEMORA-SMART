export default function ProductCard({ product, onAdd }) {
  // TODO: use formatPrice from utils instead of formatting here
  const price = "₦" + (product.price / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  return (
    <article className="card">
      <h3>{product.name}</h3>
      <p>{price}</p>
      <button onClick={() => onAdd(product)}>Add to cart</button>
    </article>
  );
}
