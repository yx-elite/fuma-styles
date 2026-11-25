import type { DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import { NotesLogo } from './logo.js';
import { repoUrl, type SiteConfig } from '../config/site.js';
import { localizeHref } from '../i18n/index.js';

/** Header title: the notes mark and the notes name */
export function NavTitle({ site }: { site: SiteConfig }) {
  return (
    <>
      <NotesLogo className="ns-nav-mark" />
      <span className="ns-nav-name">{site.name}</span>
    </>
  );
}

/**
 * The header, the same on the home page and in the docs: the title across the top,
 * see-through until the page scrolls, linking to this language's home page.
 * Kept apart from layout.tsx so the client-side home layout can use it without
 * pulling in the Lucide icon set.
 */
export function baseOptions(site: SiteConfig): Pick<DocsLayoutProps, 'nav' | 'themeSwitch' | 'githubUrl'> {
  return {
    nav: { title: <NavTitle site={site} />, url: localizeHref('/', site), transparentMode: 'top', mode: 'top' },
    themeSwitch: { mode: 'light-dark-system' },
    githubUrl: repoUrl(site),
  };
}
