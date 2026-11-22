import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import api from "../../../services/api.js";
import SongCard from "./SongCard.jsx";

function RecentlyAdded() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchSongs = async () => {
      try {
        const { data } = await api.get("/songs", {
          params: { limit: 6 },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setSongs(Array.isArray(data?.songs) ? data.songs : []);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err.response?.data?.message || "Failed to load recently added songs.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSongs();

    return () => controller.abort();
  }, []);

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      aria-labelledby="recently-added-heading"
    >
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2
            id="recently-added-heading"
            className="text-2xl font-bold text-foreground"
          >
            Recently Added
          </h2>

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

      {loading ? (
        <p className="py-8 text-center text-muted" role="status">
          Loading songs...
        </p>
      ) : error ? (
        <p className="py-8 text-center text-red-600" role="alert">
          {error}
        </p>
      ) : songs.length === 0 ? (
        <p className="py-8 text-center text-muted">
          No songs have been added yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <SongCard key={song._id} song={song} />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentlyAdded;
