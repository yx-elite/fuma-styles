import type { TOCItemType } from 'fumadocs-core/toc';
import { fillNodes, formatDate, languageOf, notesText, type LanguageConfig } from '../i18n/index.js';

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
 * Props for <DocsPage> from fumadocs-ui/layouts/notebook/page:
 * clerk-style "On this page" (hidden when a page has no headings, e.g. the glossary)
 * and the last-updated line under the previous/next buttons.
 */
export function notesPageProps({
  toc,
  lastModified,
  site,
}: {
  toc: TOCItemType[];
  lastModified?: Date;
  /** The site config, for the language of the last-updated line */
  site?: LanguageConfig;
}) {
  const hasToc = toc.length > 0;
  return {
    toc,
    tableOfContent: { style: 'clerk' as const, enabled: hasToc },
    tableOfContentPopover: { style: 'clerk' as const, enabled: hasToc },
    footer: { children: <LastUpdated date={lastModified} site={site} /> },
  };
}
