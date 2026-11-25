# Notestack

[![CI](https://github.com/yx-elite/notestack/actions/workflows/ci.yml/badge.svg)](https://github.com/yx-elite/notestack/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/@yx-elite/notestack?logo=npm&color=CB3837)](https://www.npmjs.com/package/@yx-elite/notestack) ![Fumadocs](https://img.shields.io/badge/Fumadocs-16-111111?logo=readthedocs&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

A shared theme for **study-notes sites** built with [Fumadocs](https://fumadocs.dev). One npm package, `@yx-elite/notestack`, gives every notes site the same **layout, styles, components and search**. The sites read the same way, and a fix made once reaches all of them.

[Docs](https://notestack.yxelite.dev) · [How it works](#how-it-works) · [Layout](#repository-layout) · [Develop](#develop-locally) · [New notes site](#start-a-new-notes-site) · [Roadmap](#roadmap) · [Contributing](#contributing) · [License](#license)

## How it works

Four parts, each with one job:

- **Package** → `packages/notestack/`: the theme CSS, MDX components, layouts, search and config helpers. Published to npm.
- **Docs site** → `playground/`: the theme's own docs, with setup guides and a showcase of every element. Live at [notestack.yxelite.dev](https://notestack.yxelite.dev), and used to test the package.
- **Starter** → `starter/`: the small shell that `npm create notestack` copies into a new site. Every file in it is a few lines that call the package.
- **Create command** → `packages/create-notestack/`: `npm create notestack@latest my-notes` copies the starter into a new folder and installs it. Published to npm.

All the logic lives in the package, so a notes site picks up new styles and fixes with a normal dependency update. The starter is copied only once, when a site is created.

## Repository layout

```text
notestack/
├── README.md                 ← you are here
├── LICENSE
├── AGENTS.md                 ← working rules for this repo
├── CLAUDE.md
├── CONTRIBUTING.md
├── .github/workflows/ci.yml  ← tests, type check and build on every push to main and every pull request
├── package.json              ← npm workspaces root (private)
├── playground/               ← docs site and test site (English + Chinese)
├── packages/notestack/       ← the npm package: theme, layouts, components, routes
├── packages/create-notestack/ ← the `npm create notestack` command
└── starter/                  ← template for new notes sites (one language)
```

## Develop locally

Needs **Node.js 22 or newer**. Run everything from the repo root, never inside a sub-folder:

```bash
npm install                          # installs every workspace into one node_modules/
npm run dev -w @yx-elite/notestack   # recompiles the package on every save (keep it running)
npm run dev                          # playground at http://localhost:3000
npm run dev:starter                  # starter at http://localhost:3001
npm run build                        # package, then static exports of the playground and the starter
npm run typecheck                    # package, then type-checks the playground and the starter
npm test                             # unit tests of the package and of create-notestack
```

## Start a new notes site

One command creates a site and installs it:

```bash
npm create notestack@latest my-notes
cd my-notes
npm run dev
```

Then edit `site.config.ts` and write notes in `content/docs/`. Each site is a static export that any static host can serve (Cloudflare, GitHub Pages, Netlify, Vercel, S3); the docs site has a [guide for each](https://notestack.yxelite.dev/en/docs/deployment/).

## Roadmap

1. **Scaffold** → workspace and playground. ✅
2. **Design** → the look, layout and landing page, prototyped in the playground. ✅ (mostly)
3. **Package** → move the prototype code into `@yx-elite/notestack`. ✅
4. **Languages** → one language per site, or several with a language switch. ✅
5. **Starter and `npm create notestack`** → a new site in one command. Starter ✅, command ✅.
6. **CI and first release** → checks on every push ✅, `0.1.0` on npm ✅, the docs site live at [notestack.yxelite.dev](https://notestack.yxelite.dev) ✅.
7. **First real site** → the first notes site built on the published package.

Later: more note components. Publishing an Obsidian vault as it is was tried and dropped; notes are Markdown files that Obsidian can still open.

## Contributing

Issues and pull requests are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT License](LICENSE). Built on [Fumadocs](https://fumadocs.dev) (MIT) by Fuma Nama; this is an unofficial theme, not part of the Fumadocs project.
