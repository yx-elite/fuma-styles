import { llms, loader } from 'fumadocs-core/source';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { notesSourcePlugins } from '@yx-elite/notestack/source';
import { notesLanguages } from '@yx-elite/notestack';
import site from '@/site.config';

// One folder per language: content/docs/en/…, content/docs/zh-CN/…
const i18n = notesLanguages(site);

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    // Last-updated date from each file's latest git commit
    lastModified: true,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  i18n,
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: notesSourcePlugins,
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
  // link to the files under `/llms.mdx`
  renderUrl: (item) => (/^\/.*\.(md|txt)$/.test(item.url) ? `/llms.mdx${item.url}` : item.url),
});
