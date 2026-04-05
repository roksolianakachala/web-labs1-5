import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApartmentDetails from "./pages/ApartmentDetails";
import { useAuth } from "./context/AuthContext";
import "./index.css";

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="logo">RentHome</div>

        <div className="nav-links">
          <Link to="/">Головна</Link>
          <Link to="/about">Про компанію</Link>
          <Link to="/contacts">Контакти</Link>

          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button onClick={logout} className="logout-btn">
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Вхід</Link>
              <Link to="/register">Реєстрація</Link>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/apartment/:id" element={<ApartmentDetails />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-left">
          © 2026 RentHome. Всі права захищено.
        </div>
        <div className="footer-right">
          Київ, вул. Прикладна, 1 · +380 (44) 123-45-67 · support@renthome.ua
        </div>
      </footer>
    </div>
  );
}

export default App;