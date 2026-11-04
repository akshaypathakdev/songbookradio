import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../../services/api.js";
import SongUploadForm from "../../features/admin/components/SongUploadForm.jsx";

function EditSongPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

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
          throw new Error("Song details were not found.");
        }

        setSong(fetchedSong);
        setLyrics(
          typeof lyricsResponse.data === "string" ? lyricsResponse.data : "",
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load song details.",
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
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
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
        <div
          className="rounded-xl border border-border bg-surface px-6 py-16 text-center"
          role="status"
        >
          <p className="text-sm text-muted">Loading song details...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>

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
            onSuccess={() => navigate("/admin/songs", { replace: true })}
          />
        </div>
      )}
    </div>
  );
}

export default EditSongPage;
