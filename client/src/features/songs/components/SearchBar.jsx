import { Search } from "lucide-react";

function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center rounded-xl border border-border bg-surface p-2 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
    >
      <Search size={21} className="ml-3 shrink-0 text-muted" />

      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Search songs, artists, albums..."
        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted"
      />

      <button
        type="submit"
        className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-accent"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
