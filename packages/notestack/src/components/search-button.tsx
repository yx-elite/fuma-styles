'use client';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Search } from 'lucide-react';

/** A button that opens the site search, showing its keyboard shortcut. Hidden when search is off. */
export function SearchButton({ label = 'Search the notes' }: { label?: string }) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  if (!enabled) return null;

  return (
    <button type="button" className="ns-button ns-button-secondary" onClick={() => setOpenSearch(true)}>
      <Search />
      {label}
      <span className="ns-button-keys">
        {hotKey.map((key, i) => (
          <kbd key={i}>{key.display}</kbd>
        ))}
      </span>
    </button>
  );
}
