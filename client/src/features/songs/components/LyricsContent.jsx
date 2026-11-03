import { useState } from "react";
import { Music2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

import api from "../../../services/api";

function LyricsContent({ song, lyrics }) {
  const [imageError, setImageError] = useState(false);

  const artworkUrl = `${api.defaults.baseURL}/songs/${song.slug}/artwork`;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Song Header */}
      <div className="mb-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
            {song.artwork && !imageError ? (
              <img
                src={artworkUrl}
                alt={`${song.title} artwork`}
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Music2 size={30} className="text-primary" />
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {song.title}
            </h1>

            <p className="mt-2 text-sm text-muted">
              {song.singers?.join(", ")}
            </p>

            <p className="mt-1 text-sm text-muted">
              {song.albumOrMovie || "Single"} · {song.language}
            </p>

            {song.lyricist && (
              <p className="mt-1 text-sm text-muted">Lyrics: {song.lyricist}</p>
            )}
          </div>
        </div>
      </div>

      {/* Lyrics */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <h2 className="mb-6 text-xl font-bold text-foreground">Lyrics</h2>

        <article className="text-lg leading-9 text-foreground [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mb-5 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_strong]:font-bold">
          <ReactMarkdown>{lyrics}</ReactMarkdown>
        </article>
      </div>
    </section>
  );
}

export default LyricsContent;
