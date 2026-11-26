# Changelog

All notable changes to `@yx-elite/notestack`. Versions follow [semver](https://semver.org); while in `0.x`, a breaking change bumps the minor.

## Unreleased

## 0.2.3 (2026-11-26)

Image captions read as part of the image. Nothing to change in existing sites: `npm update @yx-elite/notestack` brings it in.

### Changed

- Image captions (`<figcaption>` under an image in a `<figure>`) sit close under the image, in smaller, italic, muted text, so they read as part of the image. Before, they were full-colour text 32px below it. Code-block file names are not affected.

## 0.2.2 (2026-11-26)

A GitHub star button on Notestack's own docs site, and new wording for the package. Nothing to change in existing sites, and nothing looks different in them.

### Added

- Notestack's own docs site shows "Star on GitHub" with the repo's live star count in the landing page hero. Notes sites keep "View on GitHub"; nothing changes for them. New text key `starOnGitHub`.

### Changed

- The package description and README now read "Study notes, published beautifully. A theme for static notes sites, built on Fumadocs". Nothing changes in sites.

## 0.2.1 (2026-11-25)

The docs now live at [notestack.yxelite.dev](https://notestack.yxelite.dev). Nothing to change in existing sites.

### Changed

- `WRITING.md` sends agents to the live docs, and to their index for AI agents, [notestack.yxelite.dev/llms.txt](https://notestack.yxelite.dev/llms.txt), before Fumadocs' own.
- New sites from `create-notestack`: the starter's README and `site.config.ts` link to the live docs pages instead of the Markdown files on GitHub.
- Both packages' npm pages link to the docs site as their homepage.

## 0.2.0 (2026-11-25)

New in the package: card icons, a *With your agent* tab for the landing page, and a writing guide for AI agents. Nothing to change in existing sites: `npm update @yx-elite/notestack` brings it all. To give an existing site's AI agent the guide too, copy `AGENTS.md` and `CLAUDE.md` from the starter into the site.

### Added

- `<Card icon="Rocket">`: a card's `icon` takes a [Lucide](https://lucide.dev/icons) name, like `Callout`, and shows in an accent-tinted tile in the card's top-left corner. An element still works too.
- "Get started" on the landing page can have a second tab, *With your agent*: set `agent` in `start` (`prompt`, `steps`, `done`). A switch in the terminal's title bar moves between the tabs; the agent tab shows copy, paste and check steps beside a chat window where the prompt types in and the agent's steps tick off, a *Copy instructions* button, and a *Works with* row linking to Claude Code, Codex, Cursor, Gemini CLI, Antigravity, Grok Build and OpenCode. New type `AgentStart`. English and Simplified Chinese text built in.
- `WRITING.md`, a writing guide for AI agents, ships in the package: pages, the sidebar, every component and when to use it, images, the glossary, languages and the writing style. New sites from `create-notestack` get an `AGENTS.md` (and a `CLAUDE.md` that imports it) pointing to it. An existing site can copy those two files from the starter.

### Changed

- Cards get their own `ns-doc-card` class from `getMDXComponents()`, and `theme.css` styles that instead of matching Fumadocs' Tailwind class names, so a Fumadocs update can't silently drop the card style.
- `theme.css` drops rules for Fumadocs layouts the theme never renders and for marquee options nothing sets, and renames four internal variables to `--ns-i`, `--ns-j`, `--ns-n` and `--ns-w`. Sites need no change.

### Fixed

- Light mode: the green tick after copying a command, and the last line of the "Get started" terminal, were hard to read on light cards (2.3:1 contrast). They now use a darker green, `--ns-success` (5.0:1). Dark mode is unchanged.
- The accent picker's swatches now have a visible ring in dark mode.
- The landing page footer's repository link now uses the code font even when a site sets no `--font-mono`.

## 0.1.1 (2026-11-25)

Changes to `create-notestack` only. `@yx-elite/notestack` is published at the same version with no changes, because `create-notestack` 0.1.1 installs `^0.1.1`.

### Added

- `npm create notestack@latest .` sets up the site in the current folder, also when it is a fresh clone: `.git`, `.gitattributes`, `.gitignore`, `README.md`, `LICENSE`, `.DS_Store`, `.idea` and `.vscode` may already be there. Your `README.md` stays, the starter's lines are added to your `.gitignore`, and any other file stops the command before it writes anything. The next steps no longer print `cd .`.

### Fixed

- `create-notestack`: a folder name with no Latin letters (`笔记`) gave an empty site name and the package name `-`, and a name starting with `.` or `_` gave a package name npm rejects. The package name now drops accents and leading or trailing `.`, `_` and `-`, and falls back to `my-notes`. A folder name in another script is kept as the site name. If the template can't take the site name, the command now stops before it copies anything.

## 0.1.0 (2026-11-25)

The first release, published together with `create-notestack` 0.1.0 (`npm create notestack@latest my-notes`). From here on, each release lists its own changes under *Added*, *Changed*, *Fixed* and *Migration*.

### Setup

- **One config file.** `defineSiteConfig()` in `site.config.ts` sets the site's `name`, `author`, `tag`, `description`, `repo`, `branch`, `url`, `accent`, `bannerLink`, quick `links`, the landing page's `start` section and its languages.
- **App files are a few lines each.** `NotesRoot` is the whole root layout, and `notesMetadata()` its metadata (`Page · Site` titles, the description, and `url` as the base for share images). `NotesLayout` and `NotesHomeLayout` are the docs and landing-page layouts.
- **A static export for any file host.** `withNotestack()` (`@yx-elite/notestack/next`) sets `output: 'export'`, `trailingSlash` and unoptimised images, and lets phones and tablets on the home network load the dev server.

### Design

- Fumadocs' Black preset with one accent colour and a second tone derived from it, a background grid and glow, and Geist and JetBrains Mono. Page and section titles use Instrument Serif, shipped with the theme, with a serif fallback for Chinese. Change it with `--ns-font-display`.
- Notes read by contrast: paler body text, and plain white headings with space above them. A heading that opens a page sits as close to the divider as a paragraph does.
- Styled content: tables with an accent header row whose headers stay on one line, rounded and centred images that zoom on click, captions, cards, steps on a fading line, `<details>` that look like accordions, and accent-tinted previous and next buttons.
- A header with search, the theme switch, the language switch and GitHub. Phones and tablets get their own menu.
- Smooth page transitions between the landing page and the docs, using the View Transitions API and tuned for Safari.
- Light and dark mode for every part, and light and dark image pairs: name two files `name.light.svg` and `name.dark.svg` (also `.png` and `.jpg`), place both, and only the one for the reader's mode shows.

### Writing

- **`getMDXComponents()`** (`@yx-elite/notestack/mdx`) gives notes every component without imports: Fumadocs' Tabs, Steps, Cards, Files, TypeTable and Accordions (`type="multiple"` works), plus `Callout` and `Glossary`.
- **`Callout`** is a tinted box with its icon and title in a pill. It has five types, takes any [Lucide](https://lucide.dev/icons) `icon` by name, and takes a `color`: one of nine named colours tuned for both modes or any CSS colour. `title={false}` drops the pill for a compact aside with the icon before the text.
- **`Glossary`** shows `content/glossary.json` as a filterable A to Z list with a letter bar. Terms outside A to Z go under `#`, and every term has its own anchor.
- Sidebar icons come from `icon:` frontmatter (`notesSourcePlugins`), and *Last updated* dates from git. Under each page's previous and next buttons, the date sits on the left and a *Built with Notestack* link on the right.

### Landing page

- **`NotesHome`** builds the landing page from the notes and the config: a hero with page and section counts and the last update, a live docs preview, a "Built with" strip led by Notestack, "What's inside", "Get started" (`start`, or `false` to hide it), a search section, and a footer with the sections, links, *Back to top* and a *Built with Notestack* link to the theme's repo.
- **"What's inside"** is a mosaic of cards in different sizes. The first section is a feature card, and the others show overlapping icons, a stacked list, a large page count or one-line strips. It fits any number of sections and stacks on phones.
- Sections rise in as they scroll into view, each card's contents follow one by one, and numbers count up. With *reduce motion* on, nothing moves.

### Search, share images and AI copies

`@yx-elite/notestack/routes`, server only:

- `createNotesPage()`: the docs page, its metadata and its static params.
- `searchRoute()`: a search index built at build time and searched in the browser, one per language.
- `ogImageRoute()`: a share image for every page.
- `llmsTxtRoute()`, `llmsFullRoute()` and `llmsPageRoute()`: plain-text copies of the notes for AI assistants.

### Languages

- **One language per site.** `language` and `text` in the config. Notestack's text ships in English and Simplified Chinese, and Fumadocs' text comes from `@fumadocs/language`.
- **Several languages.** `languages` (the first is the default) and `translations`. URLs start with the language, the header shows a language switch, notes live in one folder per language, and an untranslated page shows the default language's version. `LanguageRedirect` sends readers at `/` to the language they read last. Links written as `/docs/…` get the page's language added.
- **Helpers:** `siteFor` (the config in one language), `defaultLanguageOf` and `notesLanguages` (for `loader()` in `lib/source.ts`).

### Package

- Five entry points (`@yx-elite/notestack`, `/mdx`, `/source`, `/routes` and `/next`) and `theme.css`, each exporting only what a site's files use. The CSS ships as source, with `@source "../dist"` so Tailwind finds the components' classes.
- Fumadocs, Next.js and React are peer dependencies, so a site only ever has one copy of each; `@types/react` and `@types/mdx` are optional peers for the types. Needs Node.js 22 or later (`engines`), and `@yx-elite/notestack/package.json` can be imported by tools that read it.
- The package ships `dist/`, `src/` (so *go to definition* opens the source) and its `LICENSE`. The build clears `dist/` first.
- `accentPicker` on `NotesRoot`, for demo sites, lets visitors try accent colours.
