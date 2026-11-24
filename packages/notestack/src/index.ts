// Everything a notes site imports from 'notestack'.
// Content-loader plugins live in 'notestack/source',
// the docs page and the search, share-image and llms.txt routes in 'notestack/routes',
// MDX components in 'notestack/mdx', the Next.js config helper in 'notestack/next'.
//
// Only what a site's files or the docs use is exported: adding an export later breaks
// nobody, removing one does. test/exports.test.ts lists them, so a change here is deliberate.

export { defineSiteConfig } from './config/site.js';
export type { SiteConfig, SiteTranslation, StartSection } from './config/site.js';

export { NotesRoot, notesMetadata } from './layouts/root.js';
export { NotesLayout } from './layouts/layout.js';
export { NotesHomeLayout } from './layouts/home-layout.js';
export { NotesHome } from './layouts/home.js';

export { Callout } from './components/callout.js';
export type { CalloutProps } from './components/callout.js';
export { Glossary } from './components/glossary.js';
export type { GlossaryTerm } from './components/glossary.js';

export { siteFor, defaultLanguageOf } from './i18n/index.js';
export type { NotesText } from './i18n/index.js';
export { notesLanguages } from './i18n/fumadocs.js';
export { LanguageRedirect } from './i18n/redirect.js';
