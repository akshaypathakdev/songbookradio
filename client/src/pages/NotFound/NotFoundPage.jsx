import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

function NotFoundPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <section
        aria-labelledby="not-found-heading"
        className="mx-auto max-w-lg text-center"
      >
        <p
          aria-hidden="true"
          className="text-8xl font-extrabold tracking-tight text-primary sm:text-9xl"
        >
          404
        </p>

        <h1
          id="not-found-heading"
          className="mt-5 text-2xl font-bold text-foreground sm:text-3xl"
        >
          Page Not Found
        </h1>

        <p className="mt-4 leading-7 text-muted">
          Looks like this page has gone off track. The page you're looking for
          doesn't exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Home size={18} aria-hidden="true" />
            Back to Home
          </Link>

          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Search size={18} aria-hidden="true" />
            Explore Songs
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;
