# Changelog

All notable changes to `@yx-elite/notestack`. Versions follow [semver](https://semver.org); while in `0.x`, a breaking change bumps the minor.

## Unreleased

### Added

- `@yx-elite/notestack`: `defineSiteConfig`, `SiteStyle`, `NotesLayout`, `NotesHomeLayout`, `NotesHome`, `NotesLogo`, `PageTransitions`, `AccentPicker`, `CopyButton`, `Glossary`, `SearchButton`, `notesPageProps` and `LastUpdated`.
- `@yx-elite/notestack/mdx`: `getMDXComponents()`, with fumadocs-ui's components and `Glossary`.
- `@yx-elite/notestack/source`: `notesSourcePlugins`, `pageLastModified()`, `gitLastModified()` and `urlSlugs()`, for build time only.
- `@yx-elite/notestack/next`: `withNotestack()`, which sets static export, `trailingSlash` and unoptimized images.
- `theme.css` now has `@source "../dist"`, so Tailwind generates the classes the components use.
