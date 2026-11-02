import { Music2, Search, BookOpen, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Search,
    title: "Discover Songs",
    description:
      "Find songs by title, artist, or album and explore music from different artists.",
  },
  {
    icon: BookOpen,
    title: "Explore Lyrics",
    description:
      "Read your favorite song lyrics in a clean, comfortable, and distraction-free layout.",
  },
  {
    icon: Heart,
    title: "Made for Music Lovers",
    description:
      "A simple space for people who enjoy discovering songs and connecting with their lyrics.",
  },
];

function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-accent px-4 py-20 text-on-primary sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-on-primary/15 p-4">
              <Music2 size={36} />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            About Lyricist
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-on-primary-muted sm:text-lg">
            Every song tells a story. We're here to help you discover the words
            behind the music you love.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Music is more than just sound.
          </h2>

          <p className="mt-5 text-base leading-8 text-muted">
            Lyricist is a song lyrics discovery platform built for music lovers.
            It gives you a simple way to search for songs, discover artists, and
            read the lyrics that make music meaningful.
          </p>

          <p className="mt-4 text-base leading-8 text-muted">
            Whether you're revisiting an old favorite or discovering something
            new, Lyricist makes exploring song lyrics simple and enjoyable.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              What You Can Do
            </h2>

            <p className="mt-3 text-muted">
              Everything you need to explore the words behind your favorite
              music.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-background p-7 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
                  <Icon size={27} className="text-primary" />
                </div>

                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Ready to explore?
        </h2>

        <p className="mt-3 text-muted">
          Find your favorite songs and discover the lyrics behind them.
        </p>

        <Link
          to="/search"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary transition hover:bg-accent"
        >
          <Search size={18} />
          Explore Songs
        </Link>
      </section>
    </main>
  );
}

export default AboutPage;
