import { createContext, useEffect, useMemo, useState } from "react";
import api, { clearAccessToken, setAccessToken, setupResponseInterceptor } from "../api/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // no-op
    } finally {
      clearAccessToken();
      setUser(null);
      localStorage.removeItem("clinicUser");
    }
  };

  useEffect(() => {
    const interceptorId = setupResponseInterceptor(logout);
    const savedUser = localStorage.getItem("clinicUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      api
        .post("/auth/refresh-token")
        .then((response) => setAccessToken(response.data.accessToken))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
    localStorage.setItem("clinicUser", JSON.stringify(response.data.user));
  };

  const register = async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      isDoctor: user?.role === "doctor",
      isStaff: user?.role === "staff",
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
