import { Music2 } from "lucide-react";
import SongCard from "./SongCard";

function SearchResults({ songs, query }) {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-4 py-16 text-center">
        <div className="mb-4 rounded-full bg-secondary p-4">
          <Music2 size={32} className="text-primary" />
        </div>

        <h2 className="text-xl font-bold text-foreground">No songs found</h2>

        <p className="mt-2 max-w-md text-sm text-muted">
          We couldn't find any songs matching "{query}". Try searching with
          another song title, artist, or album.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );
}

export default SearchResults;
