import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/">Головна</Link>
      <Link to="/about">Про нас</Link>
      <Link to="/contacts">Контакти</Link>

      <div>
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={logout}>Вийти</button>
          </>
        ) : (
          <>
            <Link to="/login">Вхід</Link>
            <Link to="/register">Реєстрація</Link>
          </>
        )}
      </div>
    </nav>
  );
}