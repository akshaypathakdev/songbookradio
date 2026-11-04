import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../../services/api.js";
import LyricsContent from "../../features/songs/components/LyricsContent.jsx";

function LyricsPage() {
  const { slug } = useParams();

  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  // Fetch song and lyrics
  useEffect(() => {
    const controller = new AbortController();

    const fetchSong = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);
        setSong(null);
        setLyrics("");

        const encodedSlug = encodeURIComponent(slug);

        const [songResponse, lyricsResponse] = await Promise.all([
          api.get(`/songs/${encodedSlug}`, {
            signal: controller.signal,
          }),
          api.get(`/songs/${encodedSlug}/lyrics`, {
            responseType: "text",
            signal: controller.signal,
          }),
        ]);

        if (controller.signal.aborted) return;

        const fetchedSong = songResponse.data?.song;

        if (!fetchedSong) {
          setNotFound(true);
          return;
        }

        setSong(fetchedSong);
        setLyrics(
          typeof lyricsResponse.data === "string" ? lyricsResponse.data : "",
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(
            err.response?.data?.message || "Failed to load song lyrics.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSong();

    return () => controller.abort();
  }, [slug]);

  // Dynamic SEO metadata
  useEffect(() => {
    if (!song) return;

    const previousTitle = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');

    const previousDescription = descriptionMeta?.content;

    const singers = Array.isArray(song.singers) ? song.singers.join(", ") : "";

    const description =
      song.description ||
      `Read ${song.title} lyrics${singers ? ` by ${singers}` : ""} on Lyricist.`;

    document.title = `${song.title} Lyrics | Lyricist`;

    if (descriptionMeta) {
      descriptionMeta.content = description;
    }

    return () => {
      document.title = previousTitle;

      if (descriptionMeta && previousDescription !== undefined) {
        descriptionMeta.content = previousDescription;
      }
    };
  }, [song]);

  if (loading) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center text-muted"
        role="status"
      >
        Loading lyrics...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-foreground">Song Not Found</h1>

        <p className="mt-3 text-muted">
          Sorry, we couldn't find the lyrics you're looking for.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-accent"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <p className="text-red-600" role="alert">
          {error}
        </p>
      </div>
    );
  }

  return <LyricsContent song={song} lyrics={lyrics} />;
}

export default LyricsPage;
