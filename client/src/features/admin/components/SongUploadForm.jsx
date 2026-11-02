import { useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

function SongUploadForm() {
  const [artwork, setArtwork] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // Backend integration will be added later.
    console.log({
      title: formData.get("title"),
      artist: formData.get("artist"),
      album: formData.get("album"),
      language: formData.get("language"),
      releaseYear: formData.get("releaseYear"),
      lyrics: formData.get("lyrics"),
      artwork: formData.get("artwork"),
    });

    setStatus("Form submitted. Backend upload integration is still pending.");
  };

  const handleArtworkChange = (event) => {
    setArtwork(event.target.files?.[0] || null);
    setStatus("");
  };

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
              placeholder="Enter song title"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Artist *
            </label>
            <input
              type="text"
              name="artist"
              required
              placeholder="Enter artist name"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Album
            </label>
            <input
              type="text"
              name="album"
              placeholder="Enter album name"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Language *
            </label>
            <select
              name="language"
              required
              defaultValue=""
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
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
              Release Year
            </label>
            <input
              type="number"
              name="releaseYear"
              min="1900"
              max="2100"
              placeholder="e.g. 1998"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Artwork */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Song Artwork</h2>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-6 py-10 text-center transition hover:border-primary">
          <ImagePlus size={32} className="mb-3 text-primary" />

          <span className="font-medium text-foreground">
            {artwork ? artwork.name : "Choose song artwork"}
          </span>

          <span className="mt-2 text-xs text-muted">PNG, JPG or WEBP</span>

          <input
            type="file"
            name="artwork"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleArtworkChange}
            className="sr-only"
          />
        </label>
      </section>

      <div className="border-t border-border" />

      {/* Lyrics */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Song Lyrics</h2>
          <p className="mt-1 text-sm text-muted">
            Enter the complete lyrics with line breaks preserved.
          </p>
        </div>

        <textarea
          name="lyrics"
          required
          rows={14}
          placeholder="Enter song lyrics here..."
          className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-7 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </section>

      {status && (
        <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-foreground">
          {status}
        </p>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-accent"
        >
          <Upload size={17} />
          Upload Song
        </button>
      </div>
    </form>
  );
}

export default SongUploadForm;
