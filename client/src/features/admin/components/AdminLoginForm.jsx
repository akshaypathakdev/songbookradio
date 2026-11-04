import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const formData = new FormData(event.currentTarget);

    const credentials = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    if (!credentials.email || !credentials.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(credentials);

      const requestedPath = location.state?.from?.pathname;

      const redirectTo =
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/admin") &&
        !requestedPath.startsWith("/admin/login")
          ? requestedPath
          : "/admin";

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Email Address
        </label>

        <div className="flex items-center rounded-lg border border-border bg-surface px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
          <Mail size={18} className="shrink-0 text-muted" />

          <input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="username"
            placeholder="admin@example.com"
            className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Password
        </label>

        <div className="flex items-center rounded-lg border border-border bg-surface px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
          <LockKeyhole size={18} className="shrink-0 text-muted" />

          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-controls="admin-password"
            className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted"
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            className="shrink-0 p-1 text-muted transition hover:text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export default AdminLoginForm;
