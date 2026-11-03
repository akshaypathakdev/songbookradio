import { useEffect, useRef, useState } from "react";
import { ImagePlus, Link, Upload, X } from "lucide-react";

import api from "../../../services/api";

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

  const artworkInputRef = useRef(null);

  const existingArtworkPreview =
    song?.artwork && !artworkRemoved
      ? `${api.defaults.baseURL}/songs/${song.slug}/artwork`
      : "";

  useEffect(() => {
    if (!artwork) {
      setArtworkPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(artwork);
    setArtworkPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [artwork]);

  const handleArtworkChange = (event) => {
    const file = event.target.files?.[0] || null;

    setArtwork(file);
    setArtworkRemoved(false);
    setStatus(null);
  };

  const handleRemoveArtwork = () => {
    setArtwork(null);
    setArtworkUrl("");
    setArtworkRemoved(true);

    if (artworkInputRef.current) {
      artworkInputRef.current.value = "";
    }

    setStatus(null);
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
      formData.set("artworkUrl", artworkUrl.trim());
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

      if (onSuccess) {
        onSuccess(data);
      }

      if (!isEditing) {
        form.reset();
        setArtwork(null);
        setArtworkUrl("");
        setArtworkMode("upload");
        setArtworkRemoved(false);
        setSingers("");
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
    "w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

  const previewImage =
    artworkPreview ||
    (artworkMode === "url" && artworkUrl ? artworkUrl : existingArtworkPreview);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Song Information */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-foreground">
          Song Information
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Song Title *
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={song?.title || ""}
              disabled={loading}
              placeholder="Enter song title"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Language *
            </label>
            <select
              name="language"
              required
              defaultValue={song?.language || ""}
              disabled={loading}
              className={inputClasses}
            >
              <option value="" disabled>
                Select language
              </option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Album / Movie
            </label>
            <input
              type="text"
              name="albumOrMovie"
              defaultValue={song?.albumOrMovie || ""}
              disabled={loading}
              placeholder="Enter album or movie name"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Music Director
            </label>
            <input
              type="text"
              name="musicDirector"
              defaultValue={song?.musicDirector || ""}
              disabled={loading}
              placeholder="Enter music director"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Singers *
            </label>
            <input
              type="text"
              value={singers}
              onChange={(event) => setSingers(event.target.value)}
              required
              disabled={loading}
              placeholder="e.g. Arijit Singh, Shreya Ghoshal"
              className={inputClasses}
            />
            <p className="mt-1 text-xs text-muted">
              Separate multiple singers with commas.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Lyricist
            </label>
            <input
              type="text"
              name="lyricist"
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
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
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
            onClick={() => {
              setArtworkMode("upload");
              setStatus(null);
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              artworkMode === "upload"
                ? "bg-primary text-on-primary"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            <Upload size={16} />
            Upload Image
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setArtworkMode("url");
              setStatus(null);
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              artworkMode === "url"
                ? "bg-primary text-on-primary"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            <Link size={16} />
            Image URL
          </button>
        </div>

        {artworkMode === "upload" ? (
          <>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-6 py-10 text-center transition hover:border-primary">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Artwork preview"
                  className="mb-4 h-40 w-40 rounded-xl object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <ImagePlus size={32} className="mb-3 text-primary" />
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
                type="file"
                name="artwork"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleArtworkChange}
                disabled={loading}
                className="sr-only"
              />
            </label>
          </>
        ) : (
          <div className="space-y-3">
            <input
              type="url"
              name="artworkUrl"
              value={artworkUrl}
              onChange={(event) => {
                setArtworkUrl(event.target.value);
                setArtworkRemoved(false);
              }}
              disabled={loading}
              placeholder="https://example.com/song-artwork.jpg"
              className={inputClasses}
            />

            {previewImage && (
              <img
                src={previewImage}
                alt="Artwork preview"
                className="h-40 w-40 rounded-xl border border-border object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
                onLoad={(event) => {
                  event.currentTarget.style.display = "block";
                }}
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
            <X size={15} />
            Remove current artwork
          </button>
        )}

        {artwork && (
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setArtwork(null);

              if (artworkInputRef.current) {
                artworkInputRef.current.value = "";
              }
            }}
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground disabled:opacity-60"
          >
            <X size={15} />
            Remove selected image
          </button>
        )}
      </section>

      <div className="border-t border-border" />

      {/* Lyrics */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Song Lyrics *
          </h2>
          <p className="mt-1 text-sm text-muted">
            Enter the complete lyrics. Markdown formatting is supported.
          </p>
        </div>

        <textarea
          name="lyrics"
          required
          rows={14}
          defaultValue={lyrics}
          disabled={loading}
          placeholder="Enter song lyrics here..."
          className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-7 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </section>

      {/* Status */}
      {status && (
        <p
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
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload size={17} />
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
