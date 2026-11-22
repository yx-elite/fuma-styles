// PROTOTYPE of the package's source helpers. Moves to packages/fuma-styles/src/ at migration.
import { lucideIconsPlugin } from 'fumadocs-core/source/plugins/lucide-icons';

/**
 * Plugins for Fumadocs' loader(): `icon: BookA` in a page's frontmatter
 * (or meta.json) shows that Lucide icon next to it in the sidebar.
 */
export const notesSourcePlugins = [lucideIconsPlugin()];
