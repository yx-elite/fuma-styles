import type { TOCItemType } from 'fumadocs-core/toc';
import type { SiteConfig } from '../config/site.js';
import { fillNodes, formatDate, languageOf, notesText, type LanguageConfig } from '../i18n/index.js';
import { Credit } from '../layouts/credit.js';
import { PageCard } from './page-card.js';

/** "Last updated on 23 November 2026", shown below the previous/next buttons, in the site's language */
export function LastUpdated({ date, site }: { date?: Date; site?: LanguageConfig }) {
  if (!date) return null;
  const formatted = formatDate(languageOf(site), date, { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <p className="ns-last-updated">
      {fillNodes(notesText(site).lastUpdated, { date: <time dateTime={date.toISOString()}>{formatted}</time> })}
    </p>
  );
}

/**
 * The row under the previous/next buttons: the last-updated date on the left and
 * "Built with …" on the right, crediting the same project as the landing page footer.
 */
function PageFooter({
  date,
  site,
  editUrl,
  hasToc,
}: {
  date?: Date;
  site?: SiteConfig;
  editUrl?: string;
  hasToc: boolean;
}) {
  if (!date && !site) return null;
  return (
    <>
      {/* The card from "On this page", here where that column is hidden (or the page has none) */}
      {site && (
        <div className="ns-page-footer-card" data-toc={hasToc || undefined}>
          <PageCard site={site} editUrl={editUrl} placement="footer" />
        </div>
      )}
      <div className="ns-page-footer">
        <LastUpdated date={date} site={site} />
        {site && <Credit site={site} />}
      </div>
    </>
  );
}

/**
 * Props for <DocsPage> from fumadocs-ui/layouts/notebook/page:
 * clerk-style "On this page" (hidden when a page has no headings, e.g. the glossary)
 * and the row under the previous/next buttons (last updated, Built with).
 */
export function notesPageProps({
  toc,
  lastModified,
  site,
  editUrl,
}: {
  toc: TOCItemType[];
  lastModified?: Date;
  /** The site config, for the language of the footer row and its credit */
  site?: SiteConfig;
  /** This page's file opened for editing on GitHub, for the card under "On this page" */
  editUrl?: string;
}) {
  const hasToc = toc.length > 0;
  return {
    toc,
    tableOfContent: {
      style: 'clerk' as const,
      enabled: hasToc,
      footer: site && <PageCard site={site} editUrl={editUrl} placement="toc" />,
    },
    tableOfContentPopover: { style: 'clerk' as const, enabled: hasToc },
    footer: { children: <PageFooter date={lastModified} site={site} editUrl={editUrl} hasToc={hasToc} /> },
  };
}
