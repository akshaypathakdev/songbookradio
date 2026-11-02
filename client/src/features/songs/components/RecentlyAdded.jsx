import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import songs from "../../../data/songs";
import SongCard from "./SongCard";

function RecentlyAdded() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recently Added</h2>

          <p className="mt-1 text-sm text-muted">
            Explore the latest songs added to Lyricist.
          </p>
        </div>

        <Link
          to="/search"
          className="flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-accent"
        >
          Explore all
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </section>
  );
}

export default RecentlyAdded;
