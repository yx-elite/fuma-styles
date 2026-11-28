import Link from 'fumadocs-core/link';
import { plainText } from '../config/marks.js';
import { Search } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { HomeGroup } from './home.js';
import { lucideIcon } from '../icons.js';
import { NotesLogo } from './logo.js';
import type { SiteConfig } from '../config/site.js';
import { en, type NotesText } from '../i18n/text.js';
import { fill } from '../i18n/index.js';

const MAX_SIDEBAR_ROWS = 14;
const width = (w: number) => ({ '--ns-w': `${w}%` }) as CSSProperties;

/**
 * A live miniature of the docs for the landing page: header, sidebar with the
 * real sections and pages, the first page and "On this page". Built from the
 * page tree and theme tokens, so it always matches the site, in both modes,
 * with no screenshot to keep up to date. The whole frame links to the first page.
 * <HomeEffects /> tilts it back as it scrolls into view; a light runs around its border.
 */
export function DocsPreview({
  site,
  groups,
  href,
  text = en,
}: {
  site: SiteConfig;
  groups: HomeGroup[];
  href: string;
  text?: Pick<NotesText, 'openDocs' | 'onThisPage'>;
}) {
  const first = groups[0]?.pages[0];
  const path = href.replace(/\/$/, '') + '/';

  // Sidebar rows, cut off after a screenful
  const rows: { label?: boolean; name: ReactNode; active?: boolean }[] = [];
  for (const group of groups) {
    rows.push({ label: true, name: group.name });
    for (const page of group.pages) rows.push({ name: page.name, active: page === first });
  }

  return (
    <Link href={href} className="ns-preview" aria-label={fill(text.openDocs, { name: plainText(site.name) })}>
      {/* a light that runs around the border (theme.css: .ns-preview-beam) */}
      <span className="ns-preview-beam" aria-hidden />
      <div className="ns-preview-screen" aria-hidden>
        <div className="ns-preview-bar">
          <span className="ns-preview-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="ns-preview-url">{path}</span>
        </div>

        <div className="ns-preview-header">
          <span className="ns-preview-brand">
            <NotesLogo className="ns-preview-mark" />
            {plainText(site.name)}
          </span>
          <span className="ns-preview-search">
            <Search />
            Search
            <kbd>⌘K</kbd>
          </span>
          <span className="ns-preview-icons">
            <i />
            <i />
          </span>
        </div>

        <div className="ns-preview-body">
          <div className="ns-preview-sidebar">
            <div className="ns-preview-banner">
              <b>{plainText(site.name)}</b>
              {site.tag && <small>{site.tag}</small>}
              <span className="ns-preview-line" style={width(90)} />
              <span className="ns-preview-line" style={width(60)} />
            </div>
            {(site.links ?? []).map((link) => (
              <span key={link.url} className="ns-preview-link">
                {lucideIcon(link.icon)}
                {link.text}
              </span>
            ))}
            {rows.slice(0, MAX_SIDEBAR_ROWS).map((row, i) =>
              row.label ? (
                <span key={i} className="ns-preview-label">
                  {row.name}
                </span>
              ) : (
                <span key={i} className="ns-preview-item" data-active={row.active}>
                  {row.name}
                </span>
              ),
            )}
          </div>

          <div className="ns-preview-page">
            <span className="ns-preview-title">{first?.name ?? plainText(site.name)}</span>
            <span className="ns-preview-desc">{first?.description ?? plainText(site.description)}</span>
            <span className="ns-preview-buttons">
              <i />
              <i />
            </span>
            <span className="ns-preview-rule" />
            <span className="ns-preview-line" style={width(96)} />
            <span className="ns-preview-line" style={width(88)} />
            <span className="ns-preview-line" style={width(72)} />
            <span className="ns-preview-heading" />
            <span className="ns-preview-callout">
              <span className="ns-preview-line" style={width(80)} />
              <span className="ns-preview-line" style={width(55)} />
            </span>
            <span className="ns-preview-line" style={width(92)} />
            <span className="ns-preview-line" style={width(64)} />
            <span className="ns-preview-code">
              <span>
                <i className="ns-c1" style={width(14)} />
                <i style={width(30)} />
              </span>
              <span>
                <i className="ns-c2" style={width(10)} />
                <i style={width(22)} />
                <i className="ns-c1" style={width(18)} />
              </span>
              <span>
                <i style={width(8)} />
                <i className="ns-c2" style={width(36)} />
              </span>
              <span>
                <i className="ns-c1" style={width(20)} />
              </span>
            </span>
            <span className="ns-preview-line" style={width(85)} />
          </div>

          <div className="ns-preview-toc">
            <span className="ns-preview-toc-title">{text.onThisPage}</span>
            <span className="ns-preview-toc-items">
              <span className="ns-preview-line" data-active style={width(70)} />
              <span className="ns-preview-line" style={width(85)} />
              <span className="ns-preview-line" style={width(60)} />
              <span className="ns-preview-line" style={width(75)} />
              <span className="ns-preview-line" style={width(50)} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
