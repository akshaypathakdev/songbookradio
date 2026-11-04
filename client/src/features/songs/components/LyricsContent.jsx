import { useState } from "react";
import { Music2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

import api from "../../../services/api.js";

function LyricsContent({ song, lyrics }) {
  const [imageError, setImageError] = useState(false);

  const encodedSlug = encodeURIComponent(song.slug);
  const artworkUrl = `${api.defaults.baseURL}/songs/${encodedSlug}/artwork`;

  const details = [
    {
      label: "Singers",
      value: Array.isArray(song.singers)
        ? song.singers.join(", ")
        : song.singers,
    },
    { label: "Music by", value: song.musicDirector },
    { label: "Lyrics by", value: song.lyricist },
    { label: "Album / Movie", value: song.albumOrMovie },
    { label: "Language", value: song.language },
  ].filter((detail) => detail.value);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Song Header */}
      <div className="mb-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
            {song.artwork && !imageError ? (
              <img
                src={artworkUrl}
                alt={`${song.title} artwork`}
                width="96"
                height="96"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
                onError={() => setImageError(true)}
              />
            ) : (
              <Music2 size={32} className="text-primary" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {song.title}
            </h1>

            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {details.map(({ label, value }) => (
                <div key={label} className="text-sm">
                  <span className="font-semibold text-foreground">
                    {label}:
                  </span>{" "}
                  <span className="text-muted">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lyrics */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <h2 className="mb-6 text-xl font-bold text-foreground">Lyrics</h2>

        <article className="text-lg leading-9 text-foreground [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mb-5 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_strong]:font-bold">
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>{lyrics}</ReactMarkdown>
        </article>
      </div>
    </section>
  );
}

export default LyricsContent;
