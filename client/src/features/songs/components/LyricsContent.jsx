import { Music2 } from "lucide-react";

function LyricsContent({ song }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Song Header */}
      <div className="mb-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Music2 size={30} className="text-primary" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {song.title}
            </h1>

            <p className="mt-2 text-sm text-muted">{song.artist}</p>

            <p className="mt-1 text-sm text-muted">
              {song.album} · {song.language}
            </p>
          </div>
        </div>
      </div>

      {/* Lyrics */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <h2 className="mb-6 text-xl font-bold text-foreground">Lyrics</h2>

        <p className="whitespace-pre-line text-base leading-9 text-foreground sm:text-lg">
          {song.lyrics}
        </p>
      </div>
    </section>
  );
}

export default LyricsContent;
