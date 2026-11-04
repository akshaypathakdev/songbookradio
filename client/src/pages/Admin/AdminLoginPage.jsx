import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Music2, ShieldCheck } from "lucide-react";

import AdminLoginForm from "../../features/admin/components/AdminLoginForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function AdminLoginPage() {
  const { isAuthenticated, loading, authError, checkAuth } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Checking authentication...</p>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <p className="text-sm text-muted">{authError}</p>

        <button
          type="button"
          onClick={() => checkAuth()}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Try Again
        </button>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
        >
          <ArrowLeft size={17} />
          Back to Website
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-7 shadow-sm sm:p-9">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Music2 size={30} className="text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>

            <p className="mt-2 text-sm text-muted">
              Sign in to manage the Lyricist collection.
            </p>
          </div>

          <AdminLoginForm />

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-border pt-6 text-xs text-muted">
            <ShieldCheck size={16} className="text-primary" />
            Authorized administrators only
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Lyricist · Admin Panel
        </p>
      </div>
    </main>
  );
}

export default AdminLoginPage;
