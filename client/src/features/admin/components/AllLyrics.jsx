import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit2, Music2, Trash2 } from "lucide-react";

import api from "../../../services/api.js";

function AllLyrics({ songs = [], onDelete, deletingSongId, query = "" }) {
  if (!songs.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
        <Music2 size={36} className="mx-auto text-muted" aria-hidden="true" />

        <h3 className="mt-4 font-semibold text-foreground">No songs found</h3>

        <p className="mt-2 text-sm text-muted">
          {query
            ? "Try adjusting your search."
            : "Upload your first song to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="divide-y divide-border">
        {songs.map((song) => (
          <SongRow
            key={song._id}
            song={song}
            onDelete={onDelete}
            deletingSongId={deletingSongId}
          />
        ))}
      </div>
    </div>
  );
}

function SongRow({ song, onDelete, deletingSongId }) {
  const [imageError, setImageError] = useState(false);

  const encodedSlug = encodeURIComponent(song.slug);
  const artworkUrl = `${api.defaults.baseURL}/songs/${encodedSlug}/artwork`;

  const isDeleting = deletingSongId === song._id;

  const singers = Array.isArray(song.singers) ? song.singers.join(", ") : "";

  return (
    <div className="flex items-center gap-4 p-4 transition hover:bg-background sm:p-5">
      {/* Artwork */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
        {song.artwork && !imageError ? (
          <img
            src={artworkUrl}
            alt={`${song.title} artwork`}
            width="48"
            height="48"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Music2 size={23} className="text-primary" aria-hidden="true" />
        )}
      </div>

      {/* Song Information */}
      <div className="min-w-0 flex-1">
        <Link
          to={`/lyrics/${encodedSlug}`}
          className="truncate font-semibold text-foreground transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {song.title}
        </Link>

        <p className="mt-1 truncate text-sm text-muted">
          {singers || "Unknown singer"}
          {" · "}
          {song.albumOrMovie || "Single"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <Link
          to={`/admin/songs/${encodedSlug}/edit`}
          title="Edit song"
          aria-label={`Edit ${song.title}`}
          className="rounded-lg p-2 text-muted transition hover:bg-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Edit2 size={18} aria-hidden="true" />
        </Link>

        <button
          type="button"
          onClick={() => onDelete?.(song)}
          disabled={isDeleting || !onDelete}
          title="Delete song"
          aria-label={`Delete ${song.title}`}
          aria-busy={isDeleting}
          className="rounded-lg p-2 text-muted transition hover:bg-red-100 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? (
            <span className="text-xs" role="status">
              Deleting...
            </span>
          ) : (
            <Trash2 size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

export default AllLyrics;
