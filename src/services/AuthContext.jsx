import { createContext, useState, useEffect, useContext } from "react";
import { getUserMe } from "../api/strapi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const token = auth ? JSON.parse(auth).token : null;

    if (token) {
      fetchUser(token).finally(() => setIsAuthLoading(false));
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const user = await getUserMe(token);
      setUser(user);
    } catch (err) {
      console.error("Error al obtener el usuario:", err);
      logout();
    }
  };

  const login = (jwt, user, cliente) => {
    setUser(user);

    const authData = {
      token: jwt,
      user,
      documentId: user.documentId || null,
      cliente,
    };

    // 💾 Guardar token + user en localStorage
    localStorage.setItem("auth", JSON.stringify(authData));
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
