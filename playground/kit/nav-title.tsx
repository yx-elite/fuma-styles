// PROTOTYPE of the package's layouts/ entry. Moves to packages/notestack/src/ at migration.
import { NotesLogo } from './logo';
import type { SiteConfig } from './site';

/** Header title: the notes mark and the notes name */
export function NavTitle({ site }: { site: SiteConfig }) {
  return (
    <>
      <NotesLogo className="ns-nav-mark" />
      <span className="ns-nav-name">{site.name}</span>
    </>
  );
}
