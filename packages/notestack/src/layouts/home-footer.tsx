import Link from 'fumadocs-core/link';
import { ArrowUp } from 'lucide-react';
import type { CSSProperties } from 'react';
import { repoUrl, type SiteConfig } from '../config/site.js';
import { fillNodes, formatDate, languageOf, localizeHref, type NotesText } from '../i18n/index.js';
import type { HomeGroup } from './home.js';
import { lucideIcon } from '../icons.js';
import { NotesLogo } from './logo.js';
import { Credit } from './credit.js';
import { GitHubMark } from './github-mark.js';

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
          © {year} {site.author ?? site.name}
          <span className="ns-footer-sep" aria-hidden>
            ·
          </span>
          <Credit site={site} />
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
