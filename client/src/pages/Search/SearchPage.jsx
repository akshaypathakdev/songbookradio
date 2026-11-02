import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import songs from "../../data/songs";
import SearchBar from "../../features/songs/components/SearchBar.jsx";
import SearchResults from "../../features/songs/components/SearchResults.jsx";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);

  const filteredSongs = songs.filter((song) => {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) return false;

    return (
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm) ||
      song.album.toLowerCase().includes(searchTerm)
    );
  });

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

      <section className="mt-12">
        {query ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Search Results
              </h2>

              <p className="mt-1 text-sm text-muted">
                {filteredSongs.length}{" "}
                {filteredSongs.length === 1 ? "song" : "songs"} found for
                "{query}"
              </p>
            </div>

            <SearchResults songs={filteredSongs} query={query} />
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