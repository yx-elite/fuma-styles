import { llms, loader, update } from 'fumadocs-core/source';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { obsidian } from 'fumadocs-obsidian';
import { notesSourcePlugins, urlSlugs } from '@yx-elite/notestack/source';
import { notesLanguages } from '@yx-elite/notestack';
import site from '@/site.config';

// One folder per language: content/docs/en/…, content/docs/zh-CN/…, public/vault/en/…
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

// An Obsidian vault: plain .md notes with Obsidian syntax (wikilinks, embeds, callouts).
// It sits in public/ so its images are served as they are.
const vault = obsidian({
  dir: 'public/vault',
  url: (path) => `/vault/${path.split('/').map(encodeURIComponent).join('/')}`,
});

const vaultDir = 'showcase'; // the vault's notes join the showcase pages: /docs/showcase/...
const vaultSource = await vault.staticSource({ baseDir: vaultDir });
// Vault notes keep Obsidian-style names ("Block IDs and comments.md"); their URLs get slugs
// (/en/docs/showcase/obsidian-notes). Paths may or may not include the base folder yet,
// and start with the language folder (en/…), which is not part of the URL.
const languageFolder = new RegExp(`^(${(site.languages ?? []).join('|') || '(?!)'})/`);
update(vaultSource).files((files) =>
  files.map((file) =>
    file.type === 'page'
      ? {
          ...file,
          slugs: [vaultDir, ...urlSlugs(file.path.replace(new RegExp(`^${vaultDir}/`), '').replace(languageFolder, ''))],
        }
      : file,
  ),
);

// See https://fumadocs.dev/docs/headless/source-api for more info
// Two sources in one site: MDX pages, and the vault's notes alongside the showcase pages
export const source = loader({
  i18n,
  baseUrl: docsRoute,
  source: {
    docs: docs.toFumadocsSource(),
    vault: vaultSource,
  },
  plugins: notesSourcePlugins,
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${'getText' in page.data ? await page.data.getText('processed') : page.data.content}`,
  // link to the files under `/llms.mdx`
  renderUrl: (item) => (/^\/.*\.(md|txt)$/.test(item.url) ? `/llms.mdx${item.url}` : item.url),
});
