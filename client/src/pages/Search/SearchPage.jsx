
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../../services/api.js";
import SearchBar from "../../features/songs/components/SearchBar.jsx";
import SearchResults from "../../features/songs/components/SearchResults.jsx";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = (searchParams.get("q") || "").trim();

  const [searchInput, setSearchInput] = useState(query);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setSongs([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError("");
        setSongs([]);

        const { data } = await api.get("/songs", {
          params: { search: query },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setSongs(Array.isArray(data?.songs) ? data.songs : []);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err.response?.data?.message || "Failed to search songs.",
        );
        setSongs([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSongs();

    return () => controller.abort();
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedQuery = searchInput.trim();

    if (trimmedQuery) {
      setSearchParams({ q: trimmedQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Search Songs
        </h1>

        <p className="mt-2 text-muted">
          Find your favorite songs and explore their lyrics.
        </p>

        <div className="mt-7">
          <SearchBar
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onSubmit={handleSearch}
          />
        </div>
      </div>

      <section className="mt-12" aria-live="polite">
        {query ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Search Results
              </h2>

              <p className="mt-1 text-sm text-muted">
                {loading
                  ? "Searching..."
                  : `${songs.length} ${
                      songs.length === 1 ? "song" : "songs"
                    } found for "${query}"`}
              </p>
            </div>

            <SearchResults
              songs={songs}
              query={query}
              loading={loading}
              error={error}
            />
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted">
              Enter a song title, artist, or album to get started.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchPage;
