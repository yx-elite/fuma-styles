// Everything a notes site imports from '@yx-elite/notestack'.
// Server-only helpers (git dates, loader plugins) live in '@yx-elite/notestack/source',
// MDX components in '@yx-elite/notestack/mdx', the Next.js config helper in '@yx-elite/notestack/next'.

export { defineSiteConfig, repoUrl, SiteStyle } from './config/site.js';
export type { SiteConfig, SiteTranslation, StartSection } from './config/site.js';

export { NotesLayout, baseOptions, lucideIcon } from './layouts/layout.js';
export { NotesHomeLayout } from './layouts/home-layout.js';
export { NotesHome, groupPageTree } from './layouts/home.js';
export type { HomeSource, HomePage, HomeGroup } from './layouts/home.js';
export { NotesLogo } from './layouts/logo.js';
export { PageTransitions } from './layouts/transitions.js';
export { notesStack } from './layouts/stack.js';
export type { StackItem } from './layouts/stack.js';

export { AccentPicker, AccentPickerScript, accentSwatches } from './components/accent-picker.js';
export type { AccentSwatch, AccentPickerText } from './components/accent-picker.js';
export { CopyButton } from './components/copy-button.js';
export { Glossary } from './components/glossary.js';
export type { GlossaryTerm, GlossaryText } from './components/glossary.js';
export { SearchButton } from './components/search-button.js';

export { LastUpdated, notesPageProps } from './pages/page.js';

export {
  notesText,
  siteFor,
  localizeHref,
  languageOf,
  defaultLanguageOf,
  hasLanguageRoutes,
  fill,
  fillNodes,
  plural,
  formatDate,
} from './i18n/index.js';
export type { NotesText, Plural, LanguageConfig } from './i18n/index.js';
export { notesI18n, notesLanguages, languageName } from './i18n/fumadocs.js';
export { LanguageRedirect } from './i18n/redirect.js';
export { RememberLanguage } from './i18n/remember.js';
