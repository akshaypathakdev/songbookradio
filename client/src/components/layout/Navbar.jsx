import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Music2 } from "lucide-react";

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-primary" : "text-muted hover:text-primary"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <Music2 className="h-7 w-7 text-primary" />

          <span className="text-2xl font-bold tracking-tight text-foreground">
            SongBook
          </span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="hidden max-w-xl flex-1 md:block"
        >
          <div className="flex items-center rounded-full border border-border bg-background px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <Search className="h-5 w-5 shrink-0 text-muted" />

            <input
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search songs, artists..."
              aria-label="Search songs and artists"
              className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted"
            />
          </div>
        </form>

        {/* Navigation */}
        <div className="flex shrink-0 items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hidden text-sm font-medium transition sm:block ${
                isActive ? "text-primary" : "text-muted hover:text-primary"
              }`
            }
          >
            About
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
