import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

import api from "../../services/api";
import AllLyrics from "../../features/admin/components/AllLyrics";

function AllLyricsPage() {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalSongs: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingSongId, setDeletingSongId] = useState(null);

  // Fetch songs
  useEffect(() => {
    const controller = new AbortController();

    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/songs", {
          params: {
            page: pagination.currentPage,
            limit: pagination.limit,
            search,
          },
          signal: controller.signal,
        });

        setSongs(data.songs || []);
        setPagination(data.pagination);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError(err.response?.data?.message || "Failed to load songs.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSongs();

    return () => controller.abort();
  }, [pagination.currentPage, pagination.limit, search]);

  // Search submission
  const handleSearch = (event) => {
    event.preventDefault();

    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
    }));

    setSearch(query.trim());
  };

  // Delete song
  const handleDelete = async (song) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${song.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingSongId(song._id);
      setError("");

      await api.delete(`/songs/${song._id}`);

      if (songs.length === 1 && pagination.currentPage > 1) {
        setPagination((previous) => ({
          ...previous,
          currentPage: previous.currentPage - 1,
        }));
      } else {
        // Refresh current page
        const { data } = await api.get("/songs", {
          params: {
            page: pagination.currentPage,
            limit: pagination.limit,
            search,
          },
        });

        setSongs(data.songs || []);
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete song.");
    } finally {
      setDeletingSongId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              All Lyrics
            </h1>

            <p className="mt-2 text-muted">
              Manage your uploaded songs and lyrics.
            </p>
          </div>

          <Link
            to="/admin/songs/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-accent"
          >
            <Plus size={18} />
            Upload Song
          </Link>
        </div>

        {/* Search and Count */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-lg border border-border bg-surface px-3 sm:w-96"
          >
            <Search size={19} className="shrink-0 text-muted" />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search songs, singers, albums..."
              className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted"
            />
          </form>

          <p className="text-sm text-muted">
            {pagination.totalSongs}{" "}
            {pagination.totalSongs === 1 ? "song" : "songs"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Songs List */}
        {loading ? (
          <p className="py-12 text-center text-muted">Loading songs...</p>
        ) : (
          <AllLyrics
            songs={songs}
            onDelete={handleDelete}
            deletingSongId={deletingSongId}
            query={search}
          />
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                setPagination((previous) => ({
                  ...previous,
                  currentPage: previous.currentPage - 1,
                }))
              }
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <p className="text-sm text-muted">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setPagination((previous) => ({
                  ...previous,
                  currentPage: previous.currentPage + 1,
                }))
              }
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default AllLyricsPage;
