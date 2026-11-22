// PROTOTYPE of the package's layouts/ entry. Moves to packages/fuma-styles/src/ at migration.
import { NotebookPen } from 'lucide-react';
import type { SiteConfig } from './site';

/** Header title: accent notebook mark and the notes name */
export function NavTitle({ site }: { site: SiteConfig }) {
  return (
    <>
      <span className="fs-nav-mark" aria-hidden>
        <NotebookPen />
      </span>
      <span className="fs-nav-name">{site.name}</span>
    </>
  );
}
