import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { relative } from 'node:path';
import { getPageImageUrl, gitConfig } from '@/lib/shared';
import { notesPageProps, siteFor, withoutLanguageFolder } from '@yx-elite/notestack';
import { pageLastModified } from '@yx-elite/notestack/source';
import site from '@/site.config';

export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const { lang, slug } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const local = siteFor(site, lang);
  const components = getMDXComponents(
    {
      // links to other notes by file path (`./other.mdx`);
      // Fumadocs looks pages up without their language folder
      a: createRelativeLink(source, { ...page, path: withoutLanguageFolder(page.path, site) }),
    },
    lang,
  );

  const MDX = page.data.body;

  // The file this page comes from. A page not translated yet is the default language's file.
  const file = page.absolutePath ? relative(process.cwd(), page.absolutePath) : undefined;
  const markdownUrl = `/llms.mdx${page.url}.md`;

  return (
    <DocsPage full={page.data.full} {...notesPageProps({ toc: page.data.toc, lastModified: pageLastModified(page), site: local })}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={
            file &&
            `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/playground/${encodeURI(file)}`
          }
        />
      </div>
      <DocsBody>
        <MDX components={components} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/[lang]/docs/[[...slug]]'>): Promise<Metadata> {
  const { lang, slug } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
