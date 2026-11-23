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
import * as ObsidianComponents from 'fumadocs-obsidian/ui';
import { getPageImageUrl, gitConfig } from '@/lib/shared';
import { notesPageProps } from '@yx-elite/notestack';
import { pageLastModified } from '@yx-elite/notestack/source';
import site from '@/site.config';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const components = getMDXComponents({
    // this allows you to link to other pages with relative file paths
    a: createRelativeLink(source, page),
  });

  // Two kinds of page: compiled MDX, or an Obsidian note rendered from the vault
  let body;
  let toc;
  let full: boolean | undefined;
  let file: string;
  if (page.type === 'vault') {
    const rendered = await (await page.data.load()).render({ ...components, ...ObsidianComponents });
    body = rendered.body;
    toc = rendered.toc;
    full = page.data.frontmatter.full;
    file = `public/vault/${page.path.replace(/^showcase\//, '')}`;
  } else {
    const MDX = page.data.body;
    body = <MDX components={components} />;
    toc = page.data.toc;
    full = page.data.full;
    file = `content/docs/${page.path}`;
  }

  const markdownUrl = `/llms.mdx${page.url}.md`;

  return (
    <DocsPage full={full} {...notesPageProps({ toc, lastModified: pageLastModified(page), site })}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/playground/${encodeURI(file)}`}
        />
      </div>
      <DocsBody>{body}</DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
