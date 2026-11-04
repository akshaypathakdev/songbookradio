import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Music2 } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/admin" className="flex items-center gap-2">
            <Music2 size={25} className="text-primary" />
            <span className="text-xl font-bold text-foreground">Lyricist</span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-primary">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Log out of admin account"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut size={17} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
