// PROTOTYPE of the package's pages/ entry. Moves to packages/fuma-styles/src/ at migration.
import type { TOCItemType } from 'fumadocs-core/toc';

/** "Last updated on 23 November 2026", shown below the previous/next buttons */
export function LastUpdated({ date }: { date?: Date }) {
  if (!date) return null;
  const text = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  return (
    <p className="fs-last-updated">
      Last updated on <time dateTime={date.toISOString()}>{text}</time>
    </p>
  );
}

/**
 * Props for <DocsPage> from fumadocs-ui/layouts/notebook/page:
 * clerk-style "On this page" (hidden when a page has no headings, e.g. the glossary)
 * and the last-updated line under the previous/next buttons.
 */
export function notesPageProps({ toc, lastModified }: { toc: TOCItemType[]; lastModified?: Date }) {
  const hasToc = toc.length > 0;
  return {
    toc,
    tableOfContent: { style: 'clerk' as const, enabled: hasToc },
    tableOfContentPopover: { style: 'clerk' as const, enabled: hasToc },
    footer: { children: <LastUpdated date={lastModified} /> },
  };
}
