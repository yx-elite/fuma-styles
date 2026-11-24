# Notestack

![npm](https://img.shields.io/badge/npm-notestack-CB3837?logo=npm&logoColor=white) ![Fumadocs](https://img.shields.io/badge/Fumadocs-16-111111?logo=readthedocs&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

A shared theme for **study-notes sites** built with [Fumadocs](https://fumadocs.dev). One npm package, `notestack`, gives every notes site the same **layout, styles, components and search**, so every notes site reads the same way, and a fix made once reaches all of them.

> [!NOTE]
> Work in progress. The package is not on npm yet; the [roadmap](#roadmap) lists what comes next.

[How it works](#how-it-works) · [Layout](#repository-layout) · [Develop](#develop-locally) · [New notes site](#start-a-new-notes-site) · [Roadmap](#roadmap) · [Contributing](#contributing) · [License](#license)

## How it works

Three parts, each with one job:

- **Package** → `packages/notestack/`: the theme CSS, MDX components, layouts, search and config helpers. Published to npm.
- **Docs site** → `playground/`: the theme's own docs, with setup guides and a showcase of every element. Deployed publicly, and used to test the package.
- **Starter** → `starter/`: the small shell that `npm create notestack` copies into a new site. Every file in it is a few lines that call the package.

All the logic lives in the package, so a notes site picks up new styles and fixes with a normal dependency update. The starter is copied only once, when a site is created.

## Repository layout

```text
notestack/
├── README.md                 ← you are here
├── LICENSE
├── AGENTS.md                 ← working rules for this repo
├── CLAUDE.md
├── CONTRIBUTING.md
├── package.json              ← npm workspaces root (private)
├── playground/               ← docs site and test site (English + Chinese)
├── packages/notestack/       ← the npm package: theme, layouts, components, routes
└── starter/                  ← template for new notes sites (one language)
```

## Develop locally

Needs **Node.js 22 or newer**. Run everything from the repo root, never inside a sub-folder:

```bash
npm install                          # installs every workspace into one node_modules/
npm run dev -w notestack   # recompiles the package on every save (keep it running)
npm run dev                          # playground at http://localhost:3000
npm run dev:starter                  # starter at http://localhost:3001
npm run build                        # package, then static exports of the playground and the starter
npm run typecheck                    # package, then type-checks the playground and the starter
```

## Start a new notes site

Planned, once the starter and the first npm release exist:

```bash
npm create notestack@latest my-notes
cd my-notes
npm run dev
```

Then edit `site.config.ts` and write notes in `content/docs/`. Each site is a static export that any static host can serve (Cloudflare, GitHub Pages, Netlify, Vercel, S3); the docs site has a [guide for each](https://github.com/yx-elite/notestack/tree/main/playground/content/docs/en/deployment).

## Roadmap

1. **Scaffold** → workspace and playground. ✅
2. **Design** → the look, layout and landing page, prototyped in the playground. ✅ (mostly)
3. **Package** → move the prototype code into `notestack`. ✅
4. **Languages** → one language per site, or several with a language switch. ✅
5. **Starter and `npm create notestack`** → a new site in one command. Starter ✅, command next.
6. **CI and first release** → `0.1.0` on npm, docs site deployed.
7. **First real site** → the first notes site built on the published package.

Later: more note components. Publishing an Obsidian vault as it is was tried and dropped; notes are Markdown files that Obsidian can still open.

## Contributing

Issues and pull requests are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT License](LICENSE). Built on [Fumadocs](https://fumadocs.dev) (MIT) by Fuma Nama; this is an unofficial theme, not part of the Fumadocs project.
