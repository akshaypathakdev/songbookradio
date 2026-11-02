import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import songs from "../../data/songs";
import AllLyrics from "../../features/admin/components/AllLyrics";

function AllLyricsPage() {
  const [query, setQuery] = useState("");

  const filteredSongs = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) return songs;

    return songs.filter((song) =>
      [song.title, song.artist, song.album]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchTerm)),
    );
  }, [query]);

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
          <div className="flex items-center rounded-lg border border-border bg-surface px-3 sm:w-96">
            <Search size={19} className="shrink-0 text-muted" />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search songs, artists, albums..."
              className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted"
            />
          </div>

          <p className="text-sm text-muted">
            {filteredSongs.length}{" "}
            {filteredSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>

        {/* Songs List */}
        <AllLyrics songs={filteredSongs} />
      </div>
    </main>
  );
}

export default AllLyricsPage;
