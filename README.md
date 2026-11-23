# Notestack

![npm](https://img.shields.io/badge/npm-@yx--elite/notestack-CB3837?logo=npm&logoColor=white) ![Fumadocs](https://img.shields.io/badge/Fumadocs-16-111111?logo=readthedocs&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

A shared theme for **study-notes sites** built with [Fumadocs](https://fumadocs.dev). One npm package, `@yx-elite/notestack`, gives every notes site the same **layout, styles, components and search**, so my handbooks (AWS SAA, Linux and later ones) all read the same way, and a fix made once reaches all of them.

> [!NOTE]
> Work in progress. The package is not on npm yet; the [roadmap](#roadmap) lists what comes next.

[How it works](#how-it-works) · [Layout](#repository-layout) · [Develop](#develop-locally) · [New notes site](#start-a-new-notes-site) · [Roadmap](#roadmap) · [License](#license)

## How it works

Three parts, each with one job:

- **Package** → `packages/notestack/`: the theme CSS, MDX components, layouts, search and config helpers. Published to npm.
- **Playground** → `playground/`: a full Fumadocs site that shows every component, for testing the package. Never published.
- **Starter** → `starter/`: the small shell a new notes repo is copied from. Every file in it is a few lines that call the package.

All the logic lives in the package, so a notes site picks up new styles and fixes with a normal dependency update. The starter is copied only once, when a site is created.

## Repository layout

```text
notestack/
├── README.md                 ← you are here
├── LICENSE
├── AGENTS.md                 ← working rules for this repo
├── CLAUDE.md
├── package.json              ← npm workspaces root (private)
├── playground/               ← test site
├── packages/notestack/       ← the npm package (coming next)
└── starter/                  ← template for new notes sites (planned)
```

## Develop locally

Needs **Node.js 22 or newer**. Run everything from the repo root, never inside a sub-folder:

```bash
npm install        # installs every workspace into one node_modules/
npm run dev        # playground at http://localhost:3000
npm run build      # static export of the playground into playground/out/
```

## Start a new notes site

Planned, once the starter and the first npm release exist:

```bash
npx giget@latest gh:yx-elite/notestack/starter my-notes
cd my-notes
npm install
```

Then edit `site.config.ts` and write notes in `content/docs/`. Each site is a static export, hosted on S3 behind Cloudflare.

## Roadmap

1. **Scaffold** → workspace and playground. ✅
2. **Package skeleton** → `@yx-elite/notestack` wired into the playground.
3. **Starter** → the thin template for notes sites.
4. **CI and first release** → `0.1.0` on npm.
5. **First real site** → the AWS SAA handbook.
6. **Styling** → the actual look.

## License

[MIT License](LICENSE). Built on [Fumadocs](https://fumadocs.dev) (MIT) by Fuma Nama; this is an unofficial theme, not part of the Fumadocs project.
