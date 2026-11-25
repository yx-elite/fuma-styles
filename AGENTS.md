# AGENTS.md

Rules for anyone, human or coding agent, working in this repo. The plan and its decisions live in `PRD.md`, which is local only (listed in `.git/info/exclude`, never committed); this file is the how. If `PRD.md` is missing, work from this file and ask the maintainer.

## What this repo is

**Notestack** is a shared theme for [Fumadocs](https://fumadocs.dev) study-notes sites, published to npm as **`@yx-elite/notestack`**. Every notes repo (one per subject) installs it, so they all look and behave the same. This repo holds **no study notes**.

It has three parts, and each has one job:

| Part | Path | Job | Published? |
| --- | --- | --- | --- |
| Package | `packages/notestack/` | All styling and all logic: theme CSS, MDX components, layouts, page factories, static search, config helpers | Yes, to npm |
| Docs site | `playground/` | The theme's public docs: setup and migration guides, plus a showcase of every component and edge case. Also the test site for the package | Not on npm; to be deployed as a website |
| Starter | `starter/` | The thin shell a new notes repo is copied from | No (copied by `create-notestack`) |
| Create command | `packages/create-notestack/` | `npm create notestack@latest my-notes`: copies `starter/` into a new folder and installs it | Yes, to npm |

Status: the package, `playground/`, `starter/`, `create-notestack` and CI (`.github/workflows/ci.yml`) exist; both packages are on npm (0.1.0, 2026-11-25), and the deploy workflow is planned. See `PRD.md`.

## Fumadocs docs

Fumadocs changes its APIs between versions, and they may differ from what you remember. Check the installed version in `package-lock.json` and the current docs before relying on an import path or option:

- [Writing pages](https://fumadocs.dev/docs/next/markdown.md)
- [Organizing pages and folders](https://fumadocs.dev/docs/next/page-conventions.md)
- [Customizing the UI](https://fumadocs.dev/docs/next/guides/customize-ui.md)
- [Theme and colours](https://fumadocs.dev/docs/ui/theme.md)
- [Static build](https://fumadocs.dev/docs/next/deploying/static.md)
- [Upgrading](https://fumadocs.dev/docs/next/upgrade.md)
- [Every other page (llms.txt)](https://fumadocs.dev/llms.txt)

This is the only AGENTS.md in the repo. `create-fumadocs-app` writes its own AGENTS.md into each new app; delete it and add anything useful here instead.

## The one rule that matters most

**Logic goes in the package. The starter is glue.**

A notes repo is a one-time copy of `starter/`. Later changes to `starter/` never reach repos that were already copied, but a new package version reaches all of them through `npm update`. So:

- Every starter file other than `site.config.ts`, `content/` and `package.json` is a few lines that import from `@yx-elite/notestack` and re-export. No styling, no JSX trees, no logic.
- If a starter file starts to grow, move that code into the package and make the file call it.
- **Exception, design phase:** while the look and arrangement are being designed, layout and component code may be prototyped in `playground/` first. Every such file is listed under *Design phase: to move into the package* in `PRD.md`; keep that list current. No notes repo may be created from the starter until the list is empty.
- `site.config.ts` is the only file a notes repo is expected to edit (name, url, links). Anything subject-specific belongs there or in `content/`, never in the package.
- A change that existing notes repos must also apply by hand (a new route file, a renamed export, a new config key) is a **breaking change**. It needs a major version bump and a `### Migration` entry in `packages/notestack/CHANGELOG.md` listing the exact edit for each notes repo. Avoid these.

## Layout

```text
notestack/
├── package.json              ← private npm workspaces root
├── AGENTS.md · CLAUDE.md · README.md · LICENSE
├── PRD.md                    ← local only, not committed
├── .github/
│   ├── dependabot.yml        ← weekly npm pull requests (Fumadocs grouped, Next and React grouped), monthly GitHub Actions
│   └── workflows/
│       ├── ci.yml            ← on every push to main and every pull request, Node 22 and 24: install, test, type-check, build, pack --dry-run; plus a job that creates a site from both packed packages and builds it
│       ├── fumadocs-latest.yml ← daily and by hand, Node 22 and 24: test, type-check and build with the newest Fumadocs 16.x
│       └── deploy-s3.yml     ← (planned) reusable deploy workflow that notes repos call
├── packages/create-notestack/ ← the `npm create notestack` command: index.js, test/ (node:test), and template/ copied from starter/ before each pack and each test run (git-ignored)
├── packages/notestack/       ← @yx-elite/notestack
│   ├── package.json · tsconfig.json · README.md · CHANGELOG.md
│   └── src/
│       ├── theme.css         ← tokens, fonts, styles for every component, @source for Tailwind
│       ├── components/       ← Glossary and other MDX components
│       ├── layouts/          ← root layout (NotesRoot), notes layout, home layout, landing page, banner, links
│       ├── pages/            ← docs page props ("On this page", last updated)
│       ├── routes/           ← docs page, search, share images, llms.txt; server only  (@yx-elite/notestack/routes)
│       ├── i18n/             ← languages: Notestack's text, Fumadocs' text, language helpers
│       ├── source/           ← loader plugins, last-updated dates  (@yx-elite/notestack/source)
│       ├── config/           ← SiteConfig, defineSiteConfig
│       ├── mdx.tsx           ← getMDXComponents(): every component for MDX  (@yx-elite/notestack/mdx)
│       ├── next.ts           ← withNotestack(): Next.js config, no React  (@yx-elite/notestack/next)
│       └── index.ts          ← public exports  (@yx-elite/notestack)
├── playground/               ← docs site; consumes the package via the workspace
└── starter/                  ← thin shell for new notes repos (one language, clean URLs)
```

## Package rules

- **Peer dependencies only** for `fumadocs-ui`, `fumadocs-core`, `next`, `react` and `react-dom`, plus `@types/react` and `@types/mdx` as *optional* peers (the published types import them; Fumadocs lists them the same way). Never move them to `dependencies`: two copies of fumadocs-ui break the provider, theme and search. The package doesn't import `fumadocs-mdx`, so it isn't a peer; sites install it themselves.
- **Build with `tsc`, no bundler.** One output file per source file in `dist/`, so `"use client"` survives.
- **CSS is not built.** `exports["./theme.css"]` points at `./src/theme.css` and `files` includes it, so theme edits show in the playground on save. Never point it at `dist/`.
- **Relative imports end in `.js`** (`import { NotesLogo } from './logo.js'`, even though the file is `logo.tsx`). The `./next` entry is run by plain Node, which needs the extension, and it works under Next.js too.
- **Server-only code stays out of the main entry.** Anything that uses `node:*` goes in `src/source/` (`@yx-elite/notestack/source`, for `lib/source.ts`) or `src/routes/` (`@yx-elite/notestack/routes`, for files in `app/`), never re-exported from `src/index.ts`.
- **Route segment config stays in the app.** `revalidate`, `dynamicParams` and `dynamic` must be literals in each route file (Next.js reads them without running the code); helpers in `src/routes/` return the handlers and `generateStaticParams`, never these.
- **`"use client"` goes on the first line** of any component that uses state, effects, browser APIs or event handlers. Keep everything else a server component.
- **Every MDX component is wired in three places** in the same change: exported from `src/index.ts`, added to `getMDXComponents()` in `src/mdx.tsx`, and shown on a playground page.
- **Export only what a site uses.** An export is a promise: removing or renaming one after a release breaks the sites that import it, while adding one later breaks nobody. Export a name only when a starter file, the playground or a docs guide imports it, and add it to the list in `packages/notestack/test/exports.test.ts`, which fails on any change to the public names, and to the docs' API reference (`playground/content/docs/en/api.mdx`).
- **Separate entry point for non-React code.** `next.config.mjs` in notes repos imports from `@yx-elite/notestack/next`. That entry point must never import React or a `.css` file.
- **`fumadocs-ui` may be an alias.** The scaffold installs `"fumadocs-ui": "npm:@fumadocs/base-ui@…"`. Always import from `fumadocs-ui/...`, never from `@fumadocs/base-ui`.
- **Tailwind v4 skips `node_modules`.** Once the package has components, `src/theme.css` needs an `@source "../dist";` line so a notes repo's Tailwind sees their classes. Check this in the starter build, not only the playground.
- **Override Fumadocs tokens, don't fight its classes.** Change the `--color-fd-*` variables and fumadocs-ui's documented CSS first. Prefix custom CSS variables with `--ns-` and custom class names with `ns-`.
- **Build on fumadocs-ui components where they exist** (`Callout`, `Steps`, `ImageZoom`, `Tabs`, `Accordion`) instead of rewriting them.
- **Light and dark mode both work** for every token and component. Check both in the playground.
- **Keep page transitions smooth in Safari.** Safari (WebKit) re-draws transformed or skewed elements with repeating backgrounds on every animation frame: a CSS-skewed grid dropped transitions to ~10 fps there (Chrome stayed at 60). Never `transform` large patterned layers; pre-render them instead (the background grid is a pre-skewed SVG, generated by `packages/notestack/scripts/grid-svg.py`). Animate only `opacity` and `transform` of the transitioning elements, never `filter: blur()`. Test transitions in WebKit as well as Chrome.
- **No branding or subject content in the package.** Names, links, colours that belong to one subject, and glossary terms all come from the notes repo.

## Static export rules

Every notes repo is a static export (`output: 'export'`) served from S3. Nothing in the package or starter may need a server:

- No middleware, ISR or `revalidate` numbers, cookies, headers, server actions or dynamic route handlers.
- Search is Fumadocs' static mode: an index built at build time, searched in the browser.
- `next/image` runs with `images.unoptimized: true`.
- `trailingSlash: true`, so S3 serves `docs/x/index.html` for `/docs/x/`.
- Browser-only state (e.g. checklist ticks) uses `localStorage`, wrapped in `try/catch`, and the page must render correctly without it.

## Commands

The maintainer runs installs, builds and publishes themselves. Give the exact command and say what it does instead of running it, unless they ask you to run it.

All commands run from the repo root (npm workspaces):

```bash
npm install                                   # install every workspace
npm run build -w @yx-elite/notestack          # compile the package to dist/ (tsc)
npm run dev -w @yx-elite/notestack            # recompile the package on every save (tsc --watch)
npm run dev                                   # playground at localhost:3000
npm run dev:starter                           # starter at localhost:3001
npm run build                                 # package, then static export of the playground and the starter
npm run typecheck                             # package build, then type-check the playground and the starter
npm test                                      # unit tests: the package (Vitest, packages/notestack/test/) and create-notestack (node:test)
```

The playground reads the package's compiled `dist/`, so while developing keep `npm run dev -w @yx-elite/notestack` running next to `npm run dev`.

**Stale dev cache.** Turbopack keeps its dev cache on disk in `playground/.next/`, across restarts, and doesn't notice packages appearing in `node_modules` (e.g. after `npm install` links a workspace). If the dev server keeps showing an error that a fresh `npm run build` doesn't, stop it, delete `playground/.next/` and start again. Don't add config to work around it.

Before calling a change done, everything that exists from this list must pass: the package build, the type check, the unit tests, and the static export of the playground and the starter.

**Unit tests** cover the package's plain functions (language helpers, URLs, config helpers, the landing page's sections): one file per area in `packages/notestack/test/`, outside `src/` so they are neither compiled into `dist/` nor published. Test what a caller sees (inputs and return values), with expected values taken from what the docs promise, not copied from the code's output. Components and CSS are checked in the playground, in light and dark mode, not with unit tests.

`create-notestack` has its own tests in `packages/create-notestack/test/`, on Node's built-in test runner (the command has no dependencies, so it gets no Vitest). They copy `starter/` into `template/`, run `index.js` in scratch folders and check the files it leaves: names, the current folder, refusals, and that both packages share a version. CI's `create-site` job also packs both packages, runs the packed command and builds the new site.

## Versions and publishing

- Semver. While in `0.x`, a breaking change bumps the minor.
- Never bump the version, run `npm publish` or create tags unless the maintainer asks.
- Every user-visible change gets a line in `packages/notestack/CHANGELOG.md` under *Unreleased*.
- Since `0.1.0`, each release gets its own section (`## 0.2.0 (date)`), with *Added*, *Changed*, *Fixed* and *Migration* as needed. Lines collect under *Unreleased* until then.
- `@yx-elite/notestack` and `create-notestack` always share a version number and are published together: `create-notestack` installs `@yx-elite/notestack` at `^` its own version. A test in `packages/create-notestack/test/` fails when the two versions differ.
- The reusable deploy workflow is pinned by notes repos to a major tag (`@v1`). Changing its inputs is a breaking change.

## Commit messages

The maintainer commits themselves. Suggest messages only when asked. Leave out attribution lines (no `Co-Authored-By`).

Format: `<emoji> type(scope): what changed`, with emoji from [gitmoji](https://gitmoji.dev). The scope is `pkg`, `playground`, `starter` or `ci`; leave it out for repo-wide changes.

```text
✨ feat(pkg): add Checklist component
```

- `✨ feat` → new component, option or entry point
- `💄 style` → theme, tokens, fonts, CSS
- `🐛 fix` → something broken
- `♻️ refactor` → same behaviour, different code
- `📝 docs` → README, AGENTS.md, CHANGELOG, playground copy
- `🔧 chore` → config and tooling
- `👷 ci` → GitHub Actions
- `⬆️ deps` → dependency upgrades
- `🔖 release` → version bump and changelog for a publish
- `🚚 move` → move or rename files
- `🔥 remove` → delete code or files
- `🍱 assets` → fonts, images, icons
- `💥 breaking` → a change notes repos must migrate for (also needs a CHANGELOG *Migration* entry)
- `🎉 init` → the very first commit

## Writing style

READMEs, CHANGELOG and playground copy: plain words and short sentences. Say what something does before how. Use real component names and real file paths.
