import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["", "phones", "fashion", "home"];

export default function Products({ onAdd }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts(category)
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message));
  }, [category]);

  return (
    <section>
      <h1>Products</h1>
      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c || "All"}</option>
          ))}
        </select>
      </label>
      {error && <p role="alert" className="error">{error}</p>}
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
