'use client';
// PROTOTYPE of the package's layouts/ entry. Moves to packages/notestack/src/ at migration.
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Search } from 'lucide-react';

/** A button that opens the site search, showing its keyboard shortcut. Hidden when search is off. */
export function SearchButton() {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  if (!enabled) return null;

  return (
    <button type="button" className="ns-button ns-button-secondary" onClick={() => setOpenSearch(true)}>
      <Search />
      Search the notes
      <span className="ns-button-keys">
        {hotKey.map((key, i) => (
          <kbd key={i}>{key.display}</kbd>
        ))}
      </span>
    </button>
  );
}
