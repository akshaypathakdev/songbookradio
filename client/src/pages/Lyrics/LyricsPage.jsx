import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import lyrics from "../../data/lyrics.js";
import LyricsContent from "../../features/songs/components/LyricsContent.jsx";

function LyricsPage() {
  const { slug } = useParams();

  const song = lyrics.find((item) => item.slug === slug);

  if (!song) {
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

  return <LyricsContent song={song} />;
}

export default LyricsPage;