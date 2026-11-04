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
  const [authError, setAuthError] = useState(null);

  // Verify whether an admin session exists.
  const checkAuth = useCallback(async (signal) => {
    setLoading(true);
    setAuthError(null);

    try {
      const { data } = await api.get("/admin/auth/me", { signal });

      if (!signal?.aborted) {
        setAdmin(data.admin);
      }

      return data.admin;
    } catch (error) {
      if (signal?.aborted) {
        return null;
      }

      setAdmin(null);

      if (error.response?.status === 401) {
        setAuthError(null);
      } else {
        setAuthError(
          "Unable to verify your session. Please check your connection and try again.",
        );
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
    setAuthError(null);

    const { data } = await api.post("/admin/auth/login", credentials);

    setAdmin(data.admin);
    setLoading(false);

    return data;
  };

  // Log out the admin.
  const logout = async () => {
    try {
      await api.post("/admin/auth/logout");
    } finally {
      setAdmin(null);
      setAuthError(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        authError,
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
