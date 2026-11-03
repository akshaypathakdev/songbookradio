import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../../services/api";
import LyricsContent from "../../features/songs/components/LyricsContent.jsx";

function LyricsPage() {
  const { slug } = useParams();

  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchSong = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);

        const [songResponse, lyricsResponse] = await Promise.all([
          api.get(`/songs/${slug}`, { signal: controller.signal }),
          api.get(`/songs/${slug}/lyrics`, {
            responseType: "text",
            signal: controller.signal,
          }),
        ]);

        setSong(songResponse.data.song);
        setLyrics(lyricsResponse.data);
      } catch (err) {
        if (controller.signal.aborted) return;

        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(
            err.response?.data?.message || "Failed to load song lyrics."
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">
        Loading lyrics...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Song Not Found
        </h1>

        <p className="mt-3 text-muted">
          Sorry, we couldn't find the lyrics you're looking for.
        </p>

        <Link
          to="/"
          className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-accent"
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
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return <LyricsContent song={song} lyrics={lyrics} />;
}

export default LyricsPage;
