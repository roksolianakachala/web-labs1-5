import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setMessage("Невірна електронна пошта або пароль");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Вхід</h2>
        <p className="auth-subtitle">
          Увійдіть у свій акаунт, щоб бронювати житло та залишати відгуки
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
