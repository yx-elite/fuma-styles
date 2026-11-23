import { lucideIconsPlugin } from 'fumadocs-core/source/plugins/lucide-icons';

/**
 * Plugins for Fumadocs' loader(): `icon: BookA` in a page's frontmatter
 * (or meta.json) shows that Lucide icon next to it in the sidebar.
 */
export const notesSourcePlugins = [lucideIconsPlugin()];

/**
 * A page's last-updated date: its latest git commit, which Fumadocs MDX adds
 * when the docs collection has `lastModified: true`. Undefined without it.
 */
export function pageLastModified(page: { data: object }): Date | undefined {
  const value = 'lastModified' in page.data ? page.data.lastModified : undefined;
  if (value instanceof Date || typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return undefined;
}
