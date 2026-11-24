import Link from 'fumadocs-core/link';
import { ArrowUp } from 'lucide-react';
import type { CSSProperties } from 'react';
import { repoUrl, type SiteConfig } from '../config/site.js';
import { fillNodes, formatDate, languageOf, localizeHref, type NotesText } from '../i18n/index.js';
import type { HomeGroup } from './home.js';
import { lucideIcon } from './layout.js';
import { NotesLogo } from './logo.js';

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

/**
 * The landing page's footer: the site's mark and description, a column of the
 * notes' sections and a column of links, then a bottom row with the copyright,
 * the last update and a back-to-top link. The site's name is drawn huge and faded
 * across the bottom, sized to fit its length. Styles in theme.css (Footer).
 */
export function HomeFooter({
  site,
  groups,
  updated,
  text,
}: {
  site: SiteConfig;
  groups: HomeGroup[];
  updated?: Date;
  text: NotesText;
}) {
  const language = languageOf(site);
  const sections = groups.filter((group) => group.pages.length > 0).slice(0, 6);
  const links = site.links ?? [];
  const year = (updated ?? new Date()).getUTCFullYear();

  return (
    <footer className="ns-footer" style={{ '--ns-name-length': Math.max(site.name.length, 4) } as CSSProperties}>
      <div className="ns-footer-main">
        <div className="ns-footer-brand">
          <Link href={localizeHref('/', site)} className="ns-footer-name">
            <NotesLogo className="ns-footer-logo" />
            {site.name}
          </Link>
          <p>{site.description}</p>
          <a href={repoUrl(site)} target="_blank" rel="noreferrer" className="ns-footer-repo">
            <GitHubMark />
            {site.repo}
          </a>
        </div>

        <nav className="ns-footer-columns" aria-label={text.footerNav}>
          {sections.length > 0 && (
            <div>
              <h2>{text.footerNotes}</h2>
              <ul>
                {sections.map((group, i) => (
                  <li key={i}>
                    <Link href={group.pages[0].url}>{group.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2>{text.footerLinks}</h2>
            <ul>
              {links.map((link) => (
                <li key={link.url}>
                  <Link href={localizeHref(link.url, site)}>
                    {lucideIcon(link.icon)}
                    {link.text}
                  </Link>
                </li>
              ))}
              <li>
                <a href={repoUrl(site)} target="_blank" rel="noreferrer">
                  <GitHubMark />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="ns-footer-bottom">
        <span>
          © {year} {site.author ?? site.name} ·{' '}
          <a href="https://fumadocs.dev" target="_blank" rel="noreferrer">
            {text.builtWithFumadocs}
          </a>
        </span>
        {updated && (
          <span className="ns-footer-status">
            <span className="ns-footer-dot" aria-hidden />
            <span>
              {fillNodes(text.updated, {
                date: (
                  <time dateTime={updated.toISOString()}>
                    {formatDate(language, updated, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                  </time>
                ),
              })}
            </span>
          </span>
        )}
        <a href="#" className="ns-footer-top">
          {text.backToTop}
          <ArrowUp />
        </a>
      </div>

      <div className="ns-footer-wordmark" aria-hidden>
        {site.name}
      </div>
    </footer>
  );
}
