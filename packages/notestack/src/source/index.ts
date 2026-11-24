import { lucideIconsPlugin } from 'fumadocs-core/source/plugins/lucide-icons';

/**
 * Plugins for Fumadocs' loader(): `icon: BookA` in a page's frontmatter
 * (or meta.json) shows that Lucide icon next to it in the sidebar.
 */
export const notesSourcePlugins = [lucideIconsPlugin()];
