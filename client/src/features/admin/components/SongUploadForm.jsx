import { useEffect, useRef, useState } from "react";
import { ImagePlus, Link as LinkIcon, Upload, X } from "lucide-react";

import api from "../../../services/api.js";

function SongUploadForm({ song = null, lyrics = "", onSuccess }) {
  const isEditing = Boolean(song);

  const [artwork, setArtwork] = useState(null);
  const [artworkUrl, setArtworkUrl] = useState(
    song?.artwork?.source === "external" ? song.artwork.url || "" : "",
  );
  const [artworkMode, setArtworkMode] = useState(
    song?.artwork?.source === "external" ? "url" : "upload",
  );
  const [artworkRemoved, setArtworkRemoved] = useState(false);

  const [singers, setSingers] = useState(song?.singers?.join(", ") || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [artworkPreview, setArtworkPreview] = useState("");
  const [previewError, setPreviewError] = useState(false);

  const artworkInputRef = useRef(null);

  const existingArtworkPreview =
    song?.artwork && !artworkRemoved
      ? `${api.defaults.baseURL}/songs/${encodeURIComponent(song.slug)}/artwork`
      : "";

  // Generate and clean up local artwork previews
  useEffect(() => {
    if (!artwork) {
      setArtworkPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(artwork);
    setArtworkPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [artwork]);

  // Reset preview error when the preview source changes
  useEffect(() => {
    setPreviewError(false);
  }, [artworkPreview, artworkUrl, artworkMode, existingArtworkPreview]);

  const handleArtworkChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setStatus({
        type: "error",
        message: "Only JPG, PNG, and WEBP images are allowed.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setStatus({
        type: "error",
        message: "Artwork must be smaller than 5 MB.",
      });

      event.target.value = "";
      return;
    }

    setArtwork(file);
    setArtworkRemoved(false);
    setStatus(null);
  };

  const handleRemoveArtwork = () => {
    setArtwork(null);
    setArtworkUrl("");
    setArtworkRemoved(true);
    setPreviewError(false);

    if (artworkInputRef.current) {
      artworkInputRef.current.value = "";
    }

    setStatus(null);
  };

  const handleArtworkModeChange = (mode) => {
    setArtworkMode(mode);
    setArtwork(null);
    setArtworkUrl("");
    setPreviewError(false);
    setStatus(null);

    if (artworkInputRef.current) {
      artworkInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const singerList = singers
      .split(",")
      .map((singer) => singer.trim())
      .filter(Boolean);

    if (singerList.length === 0) {
      setStatus({
        type: "error",
        message: "Please enter at least one singer.",
      });
      return;
    }

    formData.set("singers", JSON.stringify(singerList));

    // Artwork handling
    formData.delete("artwork");
    formData.delete("artworkUrl");

    if (artworkRemoved) {
      formData.set("removeArtwork", "true");
    } else if (artworkMode === "upload") {
      if (artwork) {
        formData.set("artwork", artwork);
      }
    } else {
      const trimmedArtworkUrl = artworkUrl.trim();

      if (trimmedArtworkUrl) {
        formData.set("artworkUrl", trimmedArtworkUrl);
      }
    }

    try {
      setLoading(true);
      setStatus(null);

      const { data } = isEditing
        ? await api.patch(`/songs/${song._id}`, formData)
        : await api.post("/songs", formData);

      setStatus({
        type: "success",
        message:
          data.message ||
          (isEditing
            ? "Song updated successfully!"
            : "Song uploaded successfully!"),
      });

      onSuccess?.(data);

      if (!isEditing) {
        form.reset();
        setArtwork(null);
        setArtworkUrl("");
        setArtworkMode("upload");
        setArtworkRemoved(false);
        setSingers("");
        setStatus(null);
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          (isEditing ? "Failed to update song." : "Failed to upload song."),
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60";

  const previewImage =
    artworkPreview ||
    (artworkMode === "url" && artworkUrl.trim()
      ? artworkUrl.trim()
      : existingArtworkPreview);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Song Information */}
      <section className="space-y-5" aria-labelledby="song-info-heading">
        <h2
          id="song-info-heading"
          className="text-lg font-semibold text-foreground"
        >
          Song Information
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="song-title"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Song Title *
            </label>
            <input
              id="song-title"
              type="text"
              name="title"
              required
              maxLength={150}
              defaultValue={song?.title || ""}
              disabled={loading}
              placeholder="Enter song title"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="song-language"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Language *
            </label>
            <input
              id="song-language"
              type="text"
              name="language"
              required
              maxLength={50}
              defaultValue={song?.language || "Hindi"}
              disabled={loading}
              placeholder="Enter language"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="song-album"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Album / Movie
            </label>
            <input
              id="song-album"
              type="text"
              name="albumOrMovie"
              maxLength={150}
              defaultValue={song?.albumOrMovie || ""}
              disabled={loading}
              placeholder="Enter album or movie name"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="song-music-director"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Music Director
            </label>
            <input
              id="song-music-director"
              type="text"
              name="musicDirector"
              maxLength={100}
              defaultValue={song?.musicDirector || ""}
              disabled={loading}
              placeholder="Enter music director"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="song-singers"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Singers *
            </label>
            <input
              id="song-singers"
              type="text"
              value={singers}
              onChange={(event) => setSingers(event.target.value)}
              required
              disabled={loading}
              maxLength={500}
              placeholder="e.g. Kishore Kumar, Asha Bhosle"
              className={inputClasses}
            />
            <p className="mt-1 text-xs text-muted">
              Separate multiple singers with commas.
            </p>
          </div>

          <div>
            <label
              htmlFor="song-lyricist"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Lyricist
            </label>
            <input
              id="song-lyricist"
              type="text"
              name="lyricist"
              maxLength={100}
              defaultValue={song?.lyricist || ""}
              disabled={loading}
              placeholder="Enter lyricist name"
              className={inputClasses}
            />
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Artwork */}
      <section className="space-y-4" aria-labelledby="artwork-heading">
        <div>
          <h2
            id="artwork-heading"
            className="text-lg font-semibold text-foreground"
          >
            Song Artwork
          </h2>
          <p className="mt-1 text-sm text-muted">
            Optional. Upload an image or provide an external image URL.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            aria-pressed={artworkMode === "upload"}
            onClick={() => handleArtworkModeChange("upload")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              artworkMode === "upload"
                ? "bg-primary text-on-primary"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            <Upload size={16} aria-hidden="true" />
            Upload Image
          </button>

          <button
            type="button"
            disabled={loading}
            aria-pressed={artworkMode === "url"}
            onClick={() => handleArtworkModeChange("url")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              artworkMode === "url"
                ? "bg-primary text-on-primary"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            <LinkIcon size={16} aria-hidden="true" />
            Image URL
          </button>
        </div>

        {artworkMode === "upload" ? (
          <label
            htmlFor="song-artwork"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-6 py-10 text-center transition hover:border-primary"
          >
            {previewImage && !previewError ? (
              <img
                src={previewImage}
                alt="Artwork preview"
                width="160"
                height="160"
                className="mb-4 h-40 w-40 rounded-xl object-cover"
                onError={() => setPreviewError(true)}
              />
            ) : (
              <ImagePlus
                size={32}
                className="mb-3 text-primary"
                aria-hidden="true"
              />
            )}

            <span className="font-medium text-foreground">
              {artwork
                ? artwork.name
                : song?.artwork && !artworkRemoved
                  ? "Current artwork"
                  : "Choose song artwork"}
            </span>

            <span className="mt-2 text-xs text-muted">
              PNG, JPG or WEBP · Maximum 5 MB
            </span>

            <input
              ref={artworkInputRef}
              id="song-artwork"
              type="file"
              name="artwork"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleArtworkChange}
              disabled={loading}
              className="sr-only"
            />
          </label>
        ) : (
          <div className="space-y-3">
            <label
              htmlFor="artwork-url"
              className="block text-sm font-medium text-foreground"
            >
              Artwork URL
            </label>

            <input
              id="artwork-url"
              type="url"
              name="artworkUrl"
              value={artworkUrl}
              onChange={(event) => {
                setArtworkUrl(event.target.value);
                setArtworkRemoved(false);
                setStatus(null);
              }}
              disabled={loading}
              maxLength={2048}
              placeholder="https://example.com/song-artwork.jpg"
              className={inputClasses}
            />

            {previewImage && !previewError && (
              <img
                src={previewImage}
                alt="Artwork preview"
                width="160"
                height="160"
                className="h-40 w-40 rounded-xl border border-border object-cover"
                onError={() => setPreviewError(true)}
              />
            )}
          </div>
        )}

        {song?.artwork && !artworkRemoved && (
          <button
            type="button"
            disabled={loading}
            onClick={handleRemoveArtwork}
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground disabled:opacity-60"
          >
            <X size={15} aria-hidden="true" />
            Remove current artwork
          </button>
        )}

        {artwork && (
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setArtwork(null);
              setStatus(null);

              if (artworkInputRef.current) {
                artworkInputRef.current.value = "";
              }
            }}
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground disabled:opacity-60"
          >
            <X size={15} aria-hidden="true" />
            Remove selected image
          </button>
        )}
      </section>

      <div className="border-t border-border" />

      {/* Lyrics */}
      <section className="space-y-4" aria-labelledby="lyrics-heading">
        <div>
          <h2
            id="lyrics-heading"
            className="text-lg font-semibold text-foreground"
          >
            Song Lyrics *
          </h2>
          <p className="mt-1 text-sm text-muted">
            Enter the complete lyrics. Markdown formatting is supported.
          </p>
        </div>

        <textarea
          id="song-lyrics"
          name="lyrics"
          required
          rows={14}
          defaultValue={lyrics}
          disabled={loading}
          placeholder="Enter song lyrics here..."
          className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-7 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </section>

      {/* Status */}
      {status && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`rounded-lg px-4 py-3 text-sm ${
            status.type === "success"
              ? "bg-secondary text-foreground"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </p>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload size={17} aria-hidden="true" />

          {loading
            ? isEditing
              ? "Saving Changes..."
              : "Uploading..."
            : isEditing
              ? "Update Song"
              : "Upload Song"}
        </button>
      </div>
    </form>
  );
}

export default SongUploadForm;
