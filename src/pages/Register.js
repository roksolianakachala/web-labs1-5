import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../services/firebase";
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      setMessage("Реєстрація успішна!");
      navigate("/");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Реєстрація</h2>
        <p className="auth-subtitle">
          Створіть акаунт, щоб бронювати житло та залишати відгуки
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