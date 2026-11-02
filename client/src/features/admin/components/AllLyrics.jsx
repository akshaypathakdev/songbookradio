import { Link } from "react-router-dom";
import { Edit2, Music2, Trash2 } from "lucide-react";

function AllLyrics({ songs }) {
  if (songs.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
        <Music2 size={36} className="mx-auto text-muted" />

        <h3 className="mt-4 font-semibold text-foreground">No songs found</h3>

        <p className="mt-2 text-sm text-muted">
          Try another search or upload your first song.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="divide-y divide-border">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center gap-4 p-4 transition hover:bg-background sm:p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Music2 size={23} className="text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-foreground">
                {song.title}
              </h3>

              <p className="mt-1 truncate text-sm text-muted">
                {song.artist} · {song.album}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                disabled
                title="Edit functionality coming soon"
                className="rounded-lg p-2 text-muted opacity-50"
              >
                <Edit2 size={18} />
              </button>

              <button
                type="button"
                disabled
                title="Delete functionality coming soon"
                className="rounded-lg p-2 text-muted opacity-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllLyrics;
