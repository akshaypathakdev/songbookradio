import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../../services/api";
import SongUploadForm from "../../features/admin/components/SongUploadForm";

function EditSongPage() {
  const { slug } = useParams();

  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchSong = async () => {
      try {
        setLoading(true);
        setError("");

        const [songResponse, lyricsResponse] = await Promise.all([
          api.get(`/songs/${slug}`, {
            signal: controller.signal,
          }),
          api.get(`/songs/${slug}/lyrics`, {
            responseType: "text",
            signal: controller.signal,
          }),
        ]);

        if (controller.signal.aborted) return;

        setSong(songResponse.data.song);
        setLyrics(lyricsResponse.data);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error.response?.data?.message || "Failed to load song details.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSong();

    return () => controller.abort();
  }, [slug]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link
          to="/admin/songs"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to All Lyrics
        </Link>

        <h1 className="text-2xl font-bold text-foreground">Edit Song</h1>

        <p className="mt-1 text-sm text-muted">
          Update song information, artwork, and lyrics.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-sm text-muted">Loading song details...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-sm text-red-600">{error}</p>

          <Link
            to="/admin/songs"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Return to All Lyrics
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <SongUploadForm
            song={song}
            lyrics={lyrics}
            onSuccess={() => {
              window.location.href = "/admin/songs";
            }}
          />
        </div>
      )}
    </div>
  );
}

export default EditSongPage;
