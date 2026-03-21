import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <nav className="navbar">
          <div className="logo">RentHome</div>

          <div className="nav-links">
            <Link to="/">Головна</Link>
            <Link to="/about">Про компанію</Link>
            <Link to="/contacts">Контакти</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
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
    </BrowserRouter>
  );
}

export default App;
