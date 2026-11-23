// PROTOTYPE of the package's source helpers. Moves to packages/fuma-styles/src/ at migration.
import { execFileSync } from 'node:child_process';
import { lucideIconsPlugin } from 'fumadocs-core/source/plugins/lucide-icons';

/**
 * Plugins for Fumadocs' loader(): `icon: BookA` in a page's frontmatter
 * (or meta.json) shows that Lucide icon next to it in the sidebar.
 */
export const notesSourcePlugins = [lucideIconsPlugin()];

const gitDates = new Map<string, Date | undefined>();

/**
 * Date of a file's latest git commit, for sources that do not provide one
 * (an Obsidian vault). Runs at build time only; undefined for files that are
 * not committed yet, or when git is not available.
 */
export function gitLastModified(file: string | undefined): Date | undefined {
  if (!file) return undefined;
  if (gitDates.has(file)) return gitDates.get(file);

  let date: Date | undefined;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    date = out ? new Date(out) : undefined;
  } catch {
    date = undefined;
  }
  gitDates.set(file, date);
  return date;
}

/**
 * Last-updated date for any page: MDX pages carry it (`lastModified: true` on
 * the collection); other sources, like an Obsidian vault, fall back to git.
 */
export function pageLastModified(page: { data: object; absolutePath?: string }): Date | undefined {
  const value = 'lastModified' in page.data ? page.data.lastModified : undefined;
  if (value instanceof Date || typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return gitLastModified(page.absolutePath);
}

/**
 * URL-friendly slugs from a file path, for notes named the Obsidian way:
 * `obsidian/Block IDs and comments.md` → ['obsidian', 'block-ids-and-comments'].
 */
export function urlSlugs(path: string): string[] {
  return path
    .replace(/\.[^/.]+$/, '')
    .split('/')
    .map((part) =>
      part
        .normalize('NFKD')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, ''),
    )
    .filter(Boolean);
}
