import { Link } from "react-router-dom";
import { Music2 } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand */}
          <Link
            to="/"
            aria-label="Lyricist home"
            className="flex items-center gap-2"
          >
            <Music2 size={24} className="text-primary" />
            <span className="text-xl font-bold text-foreground">Lyricist</span>
          </Link>

          {/* Navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex items-center gap-6 text-sm text-muted"
          >
            <Link to="/" className="transition hover:text-primary">
              Home
            </Link>

            <Link to="/search" className="transition hover:text-primary">
              Search
            </Link>

            <Link to="/about" className="transition hover:text-primary">
              About
            </Link>
          </nav>

          {/* Admin */}
          <Link
            to="/admin/login"
            className="text-xs font-medium text-muted transition hover:text-primary"
          >
            Admin Login
          </Link>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Lyricist. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
