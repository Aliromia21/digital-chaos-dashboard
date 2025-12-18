import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

function safeParseUser() {
  const raw = localStorage.getItem("user");
  if (!raw || raw === "undefined" || raw === "null") return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => safeParseUser());

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data?.token;
    const u = res.data?.data;

    if (!token || !u?.id) {
      throw new Error("Invalid login response from server");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);

    return u;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });


    const token = res.data?.token;
    const u = res.data?.data;

    if (!token || !u?.id) {
      throw new Error("Invalid register response from server");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);

    return u;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

// Hard redirect to eliminate any lingering state
    window.location.href = "/login";
  };

  const value = useMemo(
    () => ({ user, isAuthed: !!user, login, register, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
