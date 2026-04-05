import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Помилка входу");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);
      loginUser(email);

      setMessage("Вхід успішний");
      navigate("/");
    } catch (error) {
      setMessage("Помилка з'єднання із сервером");
      console.error("Помилка входу:", error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Вхід</h2>
        <p className="auth-subtitle">
          Увійдіть у свій акаунт, щоб залишати відгуки
        </p>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Електронна пошта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Увійти</button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}