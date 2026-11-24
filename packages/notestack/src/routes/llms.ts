import { llms, type LoaderOutput } from 'fumadocs-core/source';
import type { NotesLoaderConfig } from './types.js';

/**
 * Plain-text versions of the notes for AI assistants (the llms.txt convention):
 * /llms.txt lists every page, /llms-full.txt holds them all, and each page is also
 * served as Markdown under /llms.mdx/ (the "Copy Markdown" button uses it).
 */
function notesLlms<C extends NotesLoaderConfig>(source: LoaderOutput<C>) {
  return llms(source, {
    renderPage: async (page) => `# ${page.data.title} (${page.url})\n\n${await page.data.getText('processed')}`,
    // link to the files under /llms.mdx
    renderUrl: (item) => (/^\/.*\.(md|txt)$/.test(item.url) ? `/llms.mdx${item.url}` : item.url),
  });
}

/**
 * app/llms.txt/route.ts
 *
 *   export const revalidate = false;
 *   export const GET = llmsTxtRoute(source);
 */
export function llmsTxtRoute<C extends NotesLoaderConfig>(source: LoaderOutput<C>) {
  const files = notesLlms(source);
  return async () => (await files.serve('/llms.txt'))!;
}

/**
 * app/llms-full.txt/route.ts
 *
 *   export const revalidate = false;
 *   export const GET = llmsFullRoute(source);
 */
export function llmsFullRoute<C extends NotesLoaderConfig>(source: LoaderOutput<C>) {
  const files = notesLlms(source);
  return async () => (await files.serve('/llms-full.txt'))!;
}

/**
 * app/llms.mdx/[...path]/route.ts: each page as Markdown.
 *
 *   const pages = llmsPageRoute(source);
 *   export const revalidate = false;
 *   export const dynamicParams = false;
 *   export const GET = pages.GET;
 *   export const generateStaticParams = pages.generateStaticParams;
 */
export function llmsPageRoute<C extends NotesLoaderConfig>(source: LoaderOutput<C>) {
  const files = notesLlms(source);

  async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return (await files.serve(`/${path.join('/')}`)) ?? new Response(null, { status: 404 });
  }

  async function generateStaticParams() {
    const params: { path: string[] }[] = [];
    for (const file of await files.files()) {
      // /llms.txt and /llms-full.txt have their own routes
      if (!/^\/llms(-full)?\.txt$/.test(file)) params.push({ path: decodeURI(file).slice(1).split('/') });
    }
    return params;
  }

  return { GET, generateStaticParams };
}
