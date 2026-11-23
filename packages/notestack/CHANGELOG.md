# Changelog

All notable changes to `@yx-elite/notestack`. Versions follow [semver](https://semver.org); while in `0.x`, a breaking change bumps the minor.

## Unreleased

### Added

- `@yx-elite/notestack`: `defineSiteConfig`, `SiteStyle`, `NotesLayout`, `NotesHomeLayout`, `NotesHome`, `NotesLogo`, `PageTransitions`, `AccentPicker`, `CopyButton`, `Glossary`, `SearchButton`, `notesPageProps` and `LastUpdated`.
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

### Changed

- Landing page: "What's inside" is a still bento grid. Each section's first pages are listed as numbered links (two columns on wide cards), with no moving lists. More space between sections on wide screens; on phones the docs preview sits right under the hero. The glow behind the preview is a soft blurred light with no hard edges.
- Callouts: the whole box is tinted in its colour with a coloured border; the title is a small uppercase label in that colour, followed by a fading rule.
- Cards: a soft grey gradient, lifting slightly on hover.
- Steps: numbers in accent-tinted rings on a line that fades out towards the last step.
- Images in notes have rounded corners.
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

- Glossary: terms that don't start with A–Z (digits, Chinese and other scripts) get a `#` button in the letter bar, and every term gets its own anchor. Before, they had no button, and non-Latin terms all shared the anchor `#term-`. Accented terms now file under their letter (*É* under E).
- Tablet menu: finds and shows Fumadocs' menu button by `aria-controls` (in `TabletMenu` and in `theme.css`), so the button stays visible and working when its label is translated.
