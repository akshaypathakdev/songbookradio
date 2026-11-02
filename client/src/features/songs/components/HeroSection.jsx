import { Search, Music2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = formData.get("q").trim();

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary to-accent px-4 py-20 text-on-primary sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-5 flex justify-center">
          <div className="rounded-2xl bg-on-primary/15 p-3">
            <Music2 size={32} />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Every Song Has a Story.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-on-primary-muted sm:text-lg">
          Discover your favorite songs and explore the lyrics behind the music
          you love.
        </p>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-9 flex max-w-2xl items-center rounded-xl border border-border bg-surface p-2 shadow-xl"
        >
          <Search className="ml-3 shrink-0 text-muted" size={22} />

          <input
            type="search"
            name="q"
            placeholder="Search songs, artists..."
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted sm:text-base"
          />

          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-accent sm:px-7"
          >
            Search
          </button>
        </form>

        <p className="mt-5 text-sm text-on-primary-muted">
          Find the lyrics. Feel the music.
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
