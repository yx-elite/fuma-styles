import type { LoaderConfig, Page, PageData } from 'fumadocs-core/source';
import type { TOCItemType } from 'fumadocs-core/toc';
import type { MDXComponents } from 'mdx/types';
import type { ComponentType } from 'react';

/** What the docs page and routes read from a page: the fields Fumadocs MDX gives every page */
export interface NotesPageData extends PageData {
  body: ComponentType<{ components?: MDXComponents }>;
  toc: TOCItemType[];
  /** `full: true` in frontmatter: the page uses the whole width, no "On this page" */
  full?: boolean;
  /** The page as Markdown; 'processed' needs `postprocess.includeProcessedMarkdown` (set in lib/source.ts) */
  getText: (type: 'raw' | 'processed') => Promise<string>;
}

/** A Fumadocs loader whose pages come from Fumadocs MDX (lib/source.ts) */
export interface NotesLoaderConfig extends LoaderConfig {
  page: Page<string | undefined, NotesPageData>;
}
