import { useState } from "react";
import { Link } from "react-router-dom";
import { Music2 } from "lucide-react";

import api from "../../../services/api.js";

function SongCard({ song }) {
  const [imageError, setImageError] = useState(false);

  const artworkUrl = `${api.defaults.baseURL}/songs/${song.slug}/artwork`;

  return (
    <Link
      to={`/lyrics/${song.slug}`}
      className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
        {song.artwork && !imageError ? (
          <img
            src={artworkUrl}
            alt={`${song.title} artwork`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <Music2 size={28} className="text-primary" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-foreground transition group-hover:text-primary">
          {song.title}
        </h3>

        <p className="mt-1 truncate text-sm text-muted">
          {song.singers?.join(", ")}
        </p>

        <p className="mt-1 truncate text-xs text-muted">
          {song.albumOrMovie || "Single"}
        </p>
      </div>
    </Link>
  );
}

export default SongCard;
