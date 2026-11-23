// PROTOTYPE of the package's layouts/ entry. Moves to packages/fuma-styles/src/ at migration.
import Link from 'fumadocs-core/link';
import { Search } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { HomeGroup } from './home';
import { lucideIcon } from './layout';
import { NotesLogo } from './logo';
import type { SiteConfig } from './site';

const MAX_SIDEBAR_ROWS = 14;
const width = (w: number) => ({ '--w': `${w}%` }) as CSSProperties;

/**
 * A live miniature of the docs for the landing page: header, sidebar with the
 * real sections and pages, the first page and "On this page". Built from the
 * page tree and theme tokens, so it always matches the site, in both modes,
 * with no screenshot to keep up to date. The whole frame links to the first page.
 * <HomeEffects /> tilts it back as it scrolls into view; a light runs around its border.
 */
export function DocsPreview({ site, groups, href }: { site: SiteConfig; groups: HomeGroup[]; href: string }) {
  const first = groups[0]?.pages[0];
  const path = href.replace(/\/$/, '') + '/';

  // Sidebar rows, cut off after a screenful
  const rows: { label?: boolean; name: ReactNode; active?: boolean }[] = [];
  for (const group of groups) {
    rows.push({ label: true, name: group.name });
    for (const page of group.pages) rows.push({ name: page.name, active: page === first });
  }

  return (
    <Link href={href} className="fs-preview" aria-label={`Open the docs: ${site.name}`}>
      {/* a light that runs around the border (theme.css: .fs-preview-beam) */}
      <span className="fs-preview-beam" aria-hidden />
      <div className="fs-preview-screen" aria-hidden>
        <div className="fs-preview-bar">
          <span className="fs-preview-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="fs-preview-url">{path}</span>
        </div>

        <div className="fs-preview-header">
          <span className="fs-preview-brand">
            <NotesLogo className="fs-preview-mark" />
            {site.name}
          </span>
          <span className="fs-preview-search">
            <Search />
            Search
            <kbd>⌘K</kbd>
          </span>
          <span className="fs-preview-icons">
            <i />
            <i />
          </span>
        </div>

        <div className="fs-preview-body">
          <div className="fs-preview-sidebar">
            <div className="fs-preview-banner">
              <b>{site.name}</b>
              {site.tag && <small>{site.tag}</small>}
              <span className="fs-preview-line" style={width(90)} />
              <span className="fs-preview-line" style={width(60)} />
            </div>
            {(site.links ?? []).map((link) => (
              <span key={link.url} className="fs-preview-link">
                {lucideIcon(link.icon)}
                {link.text}
              </span>
            ))}
            {rows.slice(0, MAX_SIDEBAR_ROWS).map((row, i) =>
              row.label ? (
                <span key={i} className="fs-preview-label">
                  {row.name}
                </span>
              ) : (
                <span key={i} className="fs-preview-item" data-active={row.active}>
                  {row.name}
                </span>
              ),
            )}
          </div>

          <div className="fs-preview-page">
            <span className="fs-preview-title">{first?.name ?? site.name}</span>
            <span className="fs-preview-desc">{first?.description ?? site.description}</span>
            <span className="fs-preview-buttons">
              <i />
              <i />
            </span>
            <span className="fs-preview-rule" />
            <span className="fs-preview-line" style={width(96)} />
            <span className="fs-preview-line" style={width(88)} />
            <span className="fs-preview-line" style={width(72)} />
            <span className="fs-preview-heading" />
            <span className="fs-preview-callout">
              <span className="fs-preview-line" style={width(80)} />
              <span className="fs-preview-line" style={width(55)} />
            </span>
            <span className="fs-preview-line" style={width(92)} />
            <span className="fs-preview-line" style={width(64)} />
            <span className="fs-preview-code">
              <span>
                <i className="fs-c1" style={width(14)} />
                <i style={width(30)} />
              </span>
              <span>
                <i className="fs-c2" style={width(10)} />
                <i style={width(22)} />
                <i className="fs-c1" style={width(18)} />
              </span>
              <span>
                <i style={width(8)} />
                <i className="fs-c2" style={width(36)} />
              </span>
              <span>
                <i className="fs-c1" style={width(20)} />
              </span>
            </span>
            <span className="fs-preview-line" style={width(85)} />
          </div>

          <div className="fs-preview-toc">
            <span className="fs-preview-toc-title">On this page</span>
            <span className="fs-preview-toc-items">
              <span className="fs-preview-line" data-active style={width(70)} />
              <span className="fs-preview-line" style={width(85)} />
              <span className="fs-preview-line" style={width(60)} />
              <span className="fs-preview-line" style={width(75)} />
              <span className="fs-preview-line" style={width(50)} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
