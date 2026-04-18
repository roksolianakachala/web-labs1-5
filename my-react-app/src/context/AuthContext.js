import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    if (token && userEmail) {
      setUser({
        email: userEmail,
        name: userName || "Користувач",
      });
    }
  }, []);

  const loginUser = ({ email, name }) => {
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name || "Користувач");

    setUser({
      email,
      name: name || "Користувач",
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}