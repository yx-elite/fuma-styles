import type { LoaderOutput } from 'fumadocs-core/source';
import { generateOGImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import type { SiteConfig } from '../config/site.js';
import { siteFor } from '../i18n/index.js';
import type { NotesLoaderConfig } from './types.js';
import { pageImage } from './urls.js';

/**
 * Share images: the picture a link to a page gets in chat apps and social posts,
 * with the page's title, description and the site name. One PNG per page, made at build time.
 *
 *   const og = ogImageRoute({ source, site });
 *   export const revalidate = false;
 *   export const GET = og.GET;
 *   export const generateStaticParams = og.generateStaticParams;
 */
export function ogImageRoute<C extends NotesLoaderConfig>({ source, site }: { source: LoaderOutput<C>; site: SiteConfig }) {
  async function GET(_request: Request, { params }: { params: Promise<{ lang?: string; slug: string[] }> }) {
    const { lang, slug } = await params;
    const page = source.getPage(slug.slice(0, -1), lang); // the last segment is image.png
    if (!page) notFound();

    return generateOGImage({
      title: page.data.title,
      description: page.data.description,
      site: (lang ? siteFor(site, lang) : site).name,
    });
  }

  function generateStaticParams() {
    return source.getPages().map((page) => ({
      ...(page.locale && { lang: page.locale }),
      slug: pageImage(page).segments,
    }));
  }

  return { GET, generateStaticParams };
}
