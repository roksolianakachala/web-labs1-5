import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("https://web-labs1-5.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Помилка реєстрації");
        return;
      }

      const fullName = `${firstName} ${lastName}`.trim();
      localStorage.setItem("userName", fullName);

      setMessage("Реєстрація успішна");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage("Помилка з'єднання із сервером");
      console.error("Помилка реєстрації:", error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Реєстрація</h2>
        <p className="auth-subtitle">
          Створіть акаунт, щоб залишати відгуки
        </p>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-row">
            <input
              type="text"
              placeholder="Ім'я"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Прізвище"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

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

          <button type="submit">Зареєструватися</button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}