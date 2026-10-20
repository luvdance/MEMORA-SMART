export default function Navbar({ user, cartCount, onNavigate, onSignOut }) {
  return (
    <nav className="navbar">
      <strong>Kobo Market</strong>
      <button onClick={() => onNavigate("products")}>Products</button>
      <button onClick={() => onNavigate("cart")}>Cart ({cartCount})</button>
      {user ? (
        <>
          <span>Hello, {user.name}</span>
          <button onClick={onSignOut}>Sign out</button>
        </>
      ) : (
        <button onClick={() => onNavigate("login")}>Sign in</button>
      )}
    </nav>
  );
}
