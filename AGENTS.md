# AGENTS.md

Rules for anyone, human or coding agent, working in this repo. The plan and its decisions live in `PRD.md`, which is local only (listed in `.git/info/exclude`, never committed); this file is the how. If `PRD.md` is missing, work from this file and ask the maintainer.

## What this repo is

`fuma-styles` is a shared theme for [Fumadocs](https://fumadocs.dev) study-notes sites, published to npm as **`@yx-elite/fuma-styles`**. Every notes repo (AWS SAA, Linux, and later ones) installs it, so they all look and behave the same. This repo holds **no study notes**.

It has three parts, and each has one job:

| Part | Path | Job | Published? |
| --- | --- | --- | --- |
| Package | `packages/fuma-styles/` | All styling and all logic: theme CSS, MDX components, layouts, page factories, static search, config helpers | Yes, to npm |
| Playground | `playground/` | A full Fumadocs site that shows every component and edge case, for testing the package | No |
| Starter | `starter/` | The thin shell a new notes repo is copied from | No (copied with `giget`) |

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

- Every starter file other than `site.config.ts`, `content/` and `package.json` is a few lines that import from `@yx-elite/fuma-styles` and re-export. No styling, no JSX trees, no logic.
- If a starter file starts to grow, move that code into the package and make the file call it.
- **Exception, design phase:** while the look and arrangement are being designed, layout and component code may be prototyped in `playground/` first. Every such file is listed under *Design phase: to move into the package* in `PRD.md`; keep that list current. No notes repo may be created from the starter until the list is empty.
- `site.config.ts` is the only file a notes repo is expected to edit (title, subdomain, links). Anything subject-specific belongs there or in `content/`, never in the package.
- A change that existing notes repos must also apply by hand (a new route file, a renamed export, a new config key) is a **breaking change**. It needs a major version bump and a `### Migration` entry in `packages/fuma-styles/CHANGELOG.md` listing the exact edit for each notes repo. Avoid these.

## Layout

```text
fuma-styles/
├── package.json              ← private npm workspaces root
├── AGENTS.md · CLAUDE.md · README.md · LICENSE
├── PRD.md                    ← local only, not committed
├── .github/workflows/
│   ├── ci.yml                ← builds package, playground and starter on every push
│   └── deploy-s3.yml         ← reusable deploy workflow that notes repos call
├── packages/fuma-styles/     ← @yx-elite/fuma-styles
│   ├── package.json · tsconfig.json · README.md · CHANGELOG.md
│   └── src/
│       ├── theme.css         ← tokens, fonts, numbered headings, @source for Tailwind
│       ├── components/       ← Box, Step, Figure, KeyIdea, Calc, Checklist, Term
│       ├── layouts/          ← header/footer/sidebar options, HomePage, GlossaryPage
│       ├── pages/            ← docs page factory (page, metadata, static params)
│       ├── search/           ← static search route + client options
│       ├── config/           ← defineSiteConfig, Next.js config helper
│       ├── mdx.tsx           ← getMDXComponents(): every component for MDX
│       └── index.ts          ← public exports
├── playground/               ← Fumadocs site that consumes the package via the workspace
└── starter/                  ← thin shell for new notes repos
```

## Package rules

- **Peer dependencies only** for `fumadocs-ui`, `fumadocs-core`, `fumadocs-mdx`, `next`, `react` and `react-dom`. Never move them to `dependencies`: two copies of fumadocs-ui break the provider, theme and search.
- **Build with `tsc`, no bundler.** One output file per source file in `dist/`, so `"use client"` survives.
- **CSS is not built.** `exports["./theme.css"]` points at `./src/theme.css` and `files` includes it, so theme edits show in the playground on save. Never point it at `dist/`.
- **`"use client"` goes on the first line** of any component that uses state, effects, browser APIs or event handlers. Keep everything else a server component.
- **Every component is wired in three places** in the same change: exported from `src/index.ts`, added to `getMDXComponents()` in `src/mdx.tsx`, and shown on a playground page.
- **Separate entry point for non-React code.** `next.config.mjs` in notes repos imports from `@yx-elite/fuma-styles/next`. That entry point must never import React or a `.css` file.
- **`fumadocs-ui` may be an alias.** The scaffold installs `"fumadocs-ui": "npm:@fumadocs/base-ui@…"`. Always import from `fumadocs-ui/...`, never from `@fumadocs/base-ui`.
- **Tailwind v4 skips `node_modules`.** Once the package has components, `src/theme.css` needs an `@source "../dist";` line so a notes repo's Tailwind sees their classes. Check this in the starter build, not only the playground.
- **Override Fumadocs tokens, don't fight its classes.** Change the `--color-fd-*` variables and fumadocs-ui's documented CSS first. Prefix custom CSS variables with `--fs-` and custom class names with `fs-`.
- **Build on fumadocs-ui components where they exist** (`Callout`, `Steps`, `ImageZoom`, `Tabs`, `Accordion`) instead of rewriting them.
- **Light and dark mode both work** for every token and component. Check both in the playground.
- **Keep page transitions smooth in Safari.** Safari (WebKit) re-draws transformed or skewed elements with repeating backgrounds on every animation frame: a CSS-skewed grid dropped transitions to ~10 fps there (Chrome stayed at 60). Never `transform` large patterned layers; pre-render them instead (the background grid is a pre-skewed SVG, generated by `packages/fuma-styles/scripts/grid-svg.py`). Animate only `opacity` and `transform` of the transitioning elements, never `filter: blur()`. Test transitions in WebKit as well as Chrome.
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
npm run build -w @yx-elite/fuma-styles        # compile the package to dist/
npm run dev -w playground                     # playground at localhost:3000
npm run build -w playground                   # static export of the playground
npm run build -w starter                      # static export of the starter (the real consumer test)
npm run build                                 # all of the above, in order
```

**Stale dev cache.** Turbopack keeps its dev cache on disk in `playground/.next/`, across restarts, and doesn't notice packages appearing in `node_modules` (e.g. after `npm install` links a workspace). If the dev server keeps showing an error that a fresh `npm run build` doesn't, stop it, delete `playground/.next/` and start again. Don't add config to work around it.

Before calling a change done, all of these must pass: the package build, `npm run typecheck`, and the static export of both the playground and the starter.

## Versions and publishing

- Semver. While in `0.x`, a breaking change bumps the minor.
- Never bump the version, run `npm publish` or create tags unless the maintainer asks.
- Every user-visible change gets a line in `packages/fuma-styles/CHANGELOG.md` under *Unreleased*.
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
