import { NotesLogo } from './logo.js';
import type { SiteConfig } from '../config/site.js';

/** Header title: the notes mark and the notes name */
export function NavTitle({ site }: { site: SiteConfig }) {
  return (
    <>
      <NotesLogo className="ns-nav-mark" />
      <span className="ns-nav-name">{site.name}</span>
    </>
  );
}
