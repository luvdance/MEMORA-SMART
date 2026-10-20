import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Products from "./pages/Products.jsx";
import Login from "./pages/Login.jsx";
import Cart from "./pages/Cart.jsx";
import { useAuth } from "./hooks/useAuth.js";

function loadCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

export default function App() {
  const [page, setPage] = useState("products");
  const [cart, setCart] = useState(loadCart);
  const auth = useAuth();

  function addToCart(product) {
    setCart((items) => {
      const next = [...items, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  }

  return (
    <>
      <Navbar user={auth.user} cartCount={cart.length} onNavigate={setPage} onSignOut={auth.signOut} />
      <main>
        {page === "products" && <Products onAdd={addToCart} />}
        {page === "login" && <Login onSignIn={auth.signIn} onDone={() => setPage("products")} />}
        {page === "cart" && <Cart items={cart} token={auth.token} />}
      </main>
    </>
  );
}
