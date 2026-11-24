# Changelog

All notable changes to `@yx-elite/notestack`. Versions follow [semver](https://semver.org); while in `0.x`, a breaking change bumps the minor.

## Unreleased

### Added

- `@yx-elite/notestack`: `defineSiteConfig`, `SiteStyle`, `NotesLayout`, `NotesHomeLayout`, `NotesHome`, `NotesLogo`, `PageTransitions`, `AccentPicker`, `CopyButton`, `Glossary`, `SearchButton`, `notesPageProps` and `LastUpdated`.
- `NotesRoot`: the whole root layout (`<html>`, `<body>`, accent, Fumadocs' provider with static search, page transitions; `accentPicker` for demo sites). `notesMetadata(site)`: the site name as the title (`Page · Site` on every page), the description, and `url` as the base for share-image links. `NotesProvider` and `StaticSearchDialog` for sites that build their own root layout.
- `@yx-elite/notestack/routes` (server only): `createNotesPage()` (the docs page, its metadata and static params), `searchRoute()`, `ogImageRoute()`, `llmsTxtRoute()`, `llmsFullRoute()` and `llmsPageRoute()`. Each file in `app/` is now a few lines that call one of them.
- `url` in `site.config.ts` (optional): the address the site is served from, so link previews work.
- `withNotestack()` lets phones and tablets on the home network (`192.168.*`, `10.*`) load the dev server.
- `@yx-elite/notestack/mdx`: `getMDXComponents()`, with fumadocs-ui's components and `Glossary`.
- `@yx-elite/notestack/source`: `notesSourcePlugins` (Lucide icons from `icon:` frontmatter) and `pageLastModified()`.
- `@yx-elite/notestack/next`: `withNotestack()`, which sets static export, `trailingSlash` and unoptimized images.
- `theme.css` now has `@source "../dist"`, so Tailwind generates the classes the components use.
- Languages: `language` and `text` in `site.config.ts`. A site in one language gets its `<html lang>`, dates, Fumadocs' text and Notestack's text in that language. Notestack's text ships in English and Simplified Chinese; Fumadocs' text comes from `@fumadocs/language` (Simplified and Traditional Chinese, Japanese).
- `notesI18n(site)` for `<RootProvider i18n>`, `notesText(site)` for every Notestack string, and the `fill`, `fillNodes`, `plural` and `formatDate` helpers.
- `getMDXComponents(components, { site })` and `notesPageProps({ …, site })` take the site for its language.
- Several languages in one site: `languages` (first is the default) and `translations` in `site.config.ts`. URLs start with the language (`/en/docs/…`), Fumadocs' header shows a language switch, notes live in one folder per language, and untranslated pages show the default language's page.
- `siteFor(site, lang)` gives the config for one language; `notesLanguages(site)` gives Fumadocs' language config for `loader({ i18n })`; `notesI18n(site)` adds the language switch when the site has `languages`.
- `LanguageRedirect` for the page at `/`: it sends readers to the language they read last, else their browser's language, else the default. `RememberLanguage` stores the language being read.
- Links written as `/docs/…` in notes, cards, quick links, the banner and the glossary get the page's language added (`localizeHref`). `PageTransitions` takes `languages`, and the header logo goes to the current language's home page.
- `withoutLanguageFolder(path, site)`: on a site with `languages`, pass `{ ...page, path: withoutLanguageFolder(page.path, site) }` to Fumadocs' `createRelativeLink`, so links between notes by file path (`./other.mdx`) resolve. Fumadocs looks pages up without their language folder but keeps it in `page.path`.
- Light and dark images: name two versions `name.light.svg` and `name.dark.svg`, place both, and only the one for the reader's mode shows (also `.png`, `.jpg`).
- `Callout` (also in `getMDXComponents()`): Fumadocs' callout with an `icon` that takes a [Lucide](https://lucide.dev/icons) name, e.g. `<Callout title="Exam tip" icon="GraduationCap">`. A callout without a title shows its type's name (*Note*, *Warning*…). `color` gives a callout its own colour: a named colour tuned for light and dark mode (`accent`, `blue`, `teal`, `green`, `purple`, `pink`, `orange`, `red`, `slate`; `calloutColors` lists them) or any CSS colour. New text keys: `calloutInfo`, `calloutWarning`, `calloutError`, `calloutSuccess` and `calloutIdea`. `lucideIcon()` moved to its own file; its import from `@yx-elite/notestack` is unchanged.

### Changed

- Landing page: "What's inside" is a still bento grid. Each section's first pages are listed as numbered links (two columns on wide cards), with no moving lists. More space between sections on wide screens; on phones the docs preview sits right under the hero. The glow behind the preview is a soft blurred light with no hard edges.
- Landing page footer: the site's mark, description and repository, a column of the notes' sections and one of links (`links` from `site.config.ts` and GitHub), then a row with the copyright, the last update and *Back to top*. The site's name is drawn large and faded across the bottom. New text keys: `footerNotes`, `footerLinks` and `backToTop`.
- Each note's title and the landing page's section titles use Instrument Serif, shipped with the theme (`@fontsource/instrument-serif`), with a serif fallback for Chinese. The site's name and all other text stay in Geist. Change it with `--ns-font-display`.
- Landing page: each section card lists at most three rows of pages: three pages, or three rows of two on a wide card when it has room for two columns. *And N more* counts the rest.
- Callouts: the whole box is tinted in its colour with a coloured border. The icon and title sit in a small uppercase pill at the top, and the text runs full width below, with roomier lines and a gap between paragraphs, lists and code.
- Collapsible sections (`<details>` and `<summary>` in notes) look like accordions: a bordered card with a chevron that turns when it opens, instead of the browser's plain triangle.
- Cards: a soft grey gradient, lifting slightly on hover.
- Steps: numbers in accent-tinted rings on a line that fades out towards the last step.
- Images in notes have rounded corners and are centred (inside a list, in the item's text column). Image captions are centred under them.
- Glossary: each letter is a large serif capital over a thin line, and each entry is a full-width split row: the serif headword on the left, its definition and link on the right, lighting up with the accent on hover (stacked on phones). The sticky filter bar is solid, has a light accent wash and keeps a gap below the header.
- Notes read like Clerk's docs: body text is a paler grey and headings are plain white with more space above them, so headings, bold words and links stand out by contrast alone.
- Header: the language button sits between the theme switch and GitHub; both are plain icons (GitHub larger). The language menu is frosted glass with an accent wash; its items look like sidebar links (current one in the accent colour). The search box has the same rounding as the search dialog.
- Phones: the language switch sits in the header, just before the search button, instead of in the menu's footer. In the menu, the close button is a small frosted circle in the banner's corner, and the accent picker hides while the menu is open so it no longer covers the theme switch.
- Tables: a rounded box with an accent border, an accent-tinted header row, and rows that light up on hover.
- Previous/next page buttons: more space above them, accent-tinted, smaller corners.
- Landing page buttons are lower (36px), all the same height.
- Accent picker: frosted glass button and panel.
- `NotesText`: `listSeparator` and `listEnd` are gone (the landing page no longer lists page names in a sentence).

### Fixed

- `<Accordions type="multiple">` opened one panel at a time. Fumadocs' Base UI build only knows `multiple`, so `getMDXComponents()` now turns `type="multiple"` into it. `<Accordions multiple>` works too.
- Glossary: terms that don't start with A–Z (digits, Chinese and other scripts) get a `#` button in the letter bar, and every term gets its own anchor. Before, they had no button, and non-Latin terms all shared the anchor `#term-`. Accented terms now file under their letter (*É* under E).
- Tablet menu: finds and shows Fumadocs' menu button by `aria-controls` (in `TabletMenu` and in `theme.css`), so the button stays visible and working when its label is translated.
- Switching between light and dark mode with the phone menu open no longer flashes the page and its cards over the menu. The page-transition names are now set only while a home ⇄ docs transition runs, not during Fumadocs' theme switch.
- The package build clears `dist/` first, so compiled files of deleted sources are never published. The package now ships `src/` (so editors' *go to definition* opens the source) and its `LICENSE`.
- Tablets in portrait (iPad): opening the menu fades the page dim in, instead of its edge sweeping across the screen. The dim is now its own still layer, rendered by `TabletMenu`, rather than a huge shadow on the sliding panel.
