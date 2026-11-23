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

### Fixed

- Glossary: terms that don't start with A–Z (digits, Chinese and other scripts) get a `#` button in the letter bar, and every term gets its own anchor. Before, they had no button, and non-Latin terms all shared the anchor `#term-`. Accented terms now file under their letter (*É* under E).
- Tablet menu: finds Fumadocs' menu button by `aria-controls`, so it keeps working when the button's label is translated.
