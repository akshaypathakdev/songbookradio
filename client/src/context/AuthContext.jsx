import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether an admin session already exists.
  const checkAuth = useCallback(async (signal) => {
    try {
      const { data } = await api.get("/admin/auth/me", { signal });

      if (!signal?.aborted) {
        setAdmin(data.admin);
      }

      return data.admin;
    } catch (error) {
      if (!signal?.aborted) {
        setAdmin(null);
      }

      return null;
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // Initialize authentication when the app loads.
  useEffect(() => {
    const controller = new AbortController();

    checkAuth(controller.signal);

    return () => controller.abort();
  }, [checkAuth]);

  // Log in the admin.
  const login = async (credentials) => {
    const { data } = await api.post("/admin/auth/login", credentials);

    setAdmin(data.admin);

    return data;
  };

  // Log out the admin.
  const logout = async () => {
    try {
      await api.post("/admin/auth/logout");
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: Boolean(admin),
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
