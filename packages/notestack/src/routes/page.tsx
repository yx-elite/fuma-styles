import { relative } from 'node:path';
import type { LoaderOutput } from 'fumadocs-core/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/notebook/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { repoUrl, type SiteConfig } from '../config/site.js';
import { siteFor, withoutLanguageFolder } from '../i18n/index.js';
import { getMDXComponents } from '../mdx.js';
import { notesPageProps } from '../pages/page.js';
import { pageLastModified } from '../source/index.js';
import type { NotesLoaderConfig } from './types.js';
import { pageImage, pageMarkdownUrl } from './urls.js';

/** The docs page's route params: `slug`, plus `lang` on a site with `languages` */
export interface DocsPageProps {
  params: Promise<{ lang?: string; slug?: string[] }>;
}

/**
 * Everything app/docs/[[...slug]]/page.tsx exports: the page, its metadata and
 * the list of pages to build.
 *
 *   const docs = createNotesPage({ source, site });
 *   export default docs.Page;
 *   export const generateStaticParams = docs.generateStaticParams;
 *   export const generateMetadata = docs.generateMetadata;
 */
export function createNotesPage<C extends NotesLoaderConfig>({
  source,
  site,
  components,
  repoDir = '',
}: {
  source: LoaderOutput<C>;
  site: SiteConfig;
  /** Your own MDX components, added to (or replacing) the theme's */
  components?: MDXComponents;
  /** The site's folder inside its GitHub repo, for "Open in GitHub" links. Leave it out when the site is the whole repo. */
  repoDir?: string;
}) {
  async function load({ params }: DocsPageProps) {
    const { lang, slug } = await params;
    const page = source.getPage(slug, lang);
    if (!page) notFound();
    return { page, local: lang ? siteFor(site, lang) : site };
  }

  async function Page(props: DocsPageProps) {
    const { page, local } = await load(props);
    const MDX = page.data.body;
    const mdx = getMDXComponents(
      {
        // links to other notes by file path (`./other.mdx`); on a site with `languages`,
        // Fumadocs looks pages up without their language folder
        a: createRelativeLink(source, { ...page, path: withoutLanguageFolder(page.path, site) }),
        ...components,
      },
      { site: local },
    );

    // The file this page comes from. A page not translated yet is the default language's file.
    const file = page.absolutePath ? relative(process.cwd(), page.absolutePath) : undefined;
    const folder = repoDir ? `${repoDir.replace(/\/+$/, '')}/` : '';
    const githubUrl = file && `${repoUrl(site)}/blob/${site.branch ?? 'main'}/${folder}${encodeURI(file)}`;
    const markdownUrl = pageMarkdownUrl(page);

    return (
      <DocsPage
        full={page.data.full}
        {...notesPageProps({ toc: page.data.toc, lastModified: pageLastModified(page), site: local })}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
        </div>
        <DocsBody>
          <MDX components={mdx} />
        </DocsBody>
      </DocsPage>
    );
  }

  async function generateMetadata(props: DocsPageProps): Promise<Metadata> {
    const { page } = await load(props);
    return {
      title: page.data.title,
      description: page.data.description,
      openGraph: { images: pageImage(page).url },
    };
  }

  function generateStaticParams() {
    return source.generateParams();
  }

  return { Page, generateMetadata, generateStaticParams };
}
