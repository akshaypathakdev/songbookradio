import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Plus,
  LayoutDashboard,
  Home,
} from "lucide-react";

const adminOptions = [
  {
    title: "Upload Song",
    description: "Add a new song, its details, artwork, and lyrics.",
    icon: Plus,
    path: "/admin/songs/new",
  },
  {
    title: "All Lyrics",
    description: "View and manage your uploaded songs and lyrics.",
    icon: BookOpen,
    path: "/admin/songs",
  },
];

function AdminDashboardPage() {
  return (
    <div className="bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <LayoutDashboard
              size={25}
              className="text-primary"
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-muted">
                Manage your songs and lyrics collection.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Home size={17} aria-hidden="true" />
              Back to Homepage
            </Link>
          </div>
        </div>

        {/* Dashboard Options */}
        <section aria-labelledby="content-management-heading">
          <h2
            id="content-management-heading"
            className="mb-5 text-lg font-semibold text-foreground"
          >
            Content Management
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {adminOptions.map(({ title, description, icon: Icon, path }) => (
              <Link
                key={title}
                to={path}
                className="group flex items-start gap-5 rounded-2xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary transition group-hover:bg-primary">
                  <Icon
                    size={26}
                    className="text-primary transition group-hover:text-on-primary"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground transition group-hover:text-primary">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Open
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
