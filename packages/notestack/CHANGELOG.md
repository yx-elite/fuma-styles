# Changelog

All notable changes to `@yx-elite/notestack`. Versions follow [semver](https://semver.org); while in `0.x`, a breaking change bumps the minor.

## Unreleased

### Added

- `@yx-elite/notestack`: `defineSiteConfig`, `SiteStyle`, `NotesLayout`, `NotesHomeLayout`, `NotesHome`, `NotesLogo`, `PageTransitions`, `AccentPicker`, `CopyButton`, `Glossary`, `SearchButton`, `notesPageProps` and `LastUpdated`.
- `@yx-elite/notestack/mdx`: `getMDXComponents()`, with fumadocs-ui's components and `Glossary`.
- `@yx-elite/notestack/source`: `notesSourcePlugins`, `pageLastModified()`, `gitLastModified()` and `urlSlugs()`, for build time only.
- `@yx-elite/notestack/next`: `withNotestack()`, which sets static export, `trailingSlash` and unoptimized images.
- `theme.css` now has `@source "../dist"`, so Tailwind generates the classes the components use.
- Languages: `language` and `text` in `site.config.ts`. A site in one language gets its `<html lang>`, dates, Fumadocs' text and Notestack's text in that language. Notestack's text ships in English and Simplified Chinese; Fumadocs' text comes from `@fumadocs/language` (Simplified and Traditional Chinese, Japanese).
- `notesI18n(site)` for `<RootProvider i18n>`, `notesText(site)` for every Notestack string, and the `fill`, `fillNodes`, `plural` and `formatDate` helpers.
- `getMDXComponents(components, { site })` and `notesPageProps({ …, site })` take the site for its language.
- Several languages in one site: `languages` (first is the default) and `translations` in `site.config.ts`. URLs start with the language (`/en/docs/…`), Fumadocs' header shows a language switch, notes live in one folder per language, and untranslated pages show the default language's page.
- `siteFor(site, lang)` gives the config for one language; `notesLanguages(site)` gives Fumadocs' language config for `loader({ i18n })`; `notesI18n(site)` adds the language switch when the site has `languages`.
- `LanguageRedirect` for the page at `/`: it sends readers to the language they read last, else their browser's language, else the default. `RememberLanguage` stores the language being read.
- Links written as `/docs/…` in notes, cards, quick links, the banner and the glossary get the page's language added (`localizeHref`). `PageTransitions` takes `languages`, and the header logo goes to the current language's home page.

### Fixed

- Glossary: terms that don't start with A–Z (digits, Chinese and other scripts) get a `#` button in the letter bar, and every term gets its own anchor. Before, they had no button, and non-Latin terms all shared the anchor `#term-`. Accented terms now file under their letter (*É* under E).
- Tablet menu: finds and shows Fumadocs' menu button by `aria-controls` (in `TabletMenu` and in `theme.css`), so the button stays visible and working when its label is translated.
