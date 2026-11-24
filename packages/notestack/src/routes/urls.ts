import { createGetUrl } from 'fumadocs-core/source';

/** Where docs pages live: `baseUrl` in lib/source.ts */
export const docsRoute = '/docs';
/** Where share images live: app/og/docs/[...slug]/route.tsx */
export const ogImagePath = '/og/docs';

const imageUrl = createGetUrl(ogImagePath);

/** A page's share image, e.g. /og/docs/networking/vpc/image.png (with the language first on a site with `languages`) */
export function pageImage(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: imageUrl(segments, page.locale) };
}

/** A page as Markdown, served by app/llms.mdx/[...path]/route.ts */
export const pageMarkdownUrl = (page: { url: string }) => `/llms.mdx${page.url}.md`;
