import { Search } from "lucide-react";

function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="flex items-center rounded-xl border border-border bg-surface p-2 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
    >
      <Search
        size={21}
        className="ml-3 shrink-0 text-muted"
        aria-hidden="true"
      />

      <input
        type="search"
        name="search"
        value={value}
        onChange={onChange}
        placeholder="Search songs, artists, albums..."
        aria-label="Search songs, artists, or albums"
        autoComplete="off"
        maxLength={100}
        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted"
      />

      <button
        type="submit"
        className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
