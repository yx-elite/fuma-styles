# @yx-elite/notestack

A [Fumadocs](https://fumadocs.dev) theme for study notes. It gives a notes site its layout, landing page, styles, components and static-export settings. Every site that uses it reads the same way, and gets fixes and new features through `npm update`.

## What you get

- **A landing page built from your notes**: a hero with a live preview of the docs, a contents grid of every section, search, and a "run it yourself" guide.
- **A notes layout made for reading**: calm body text, tinted callouts, accent tables, steps, cards and rounded images, in light and dark mode.
- **A glossary**: one page of terms from `content/glossary.json`, with a filter box and a letter bar, linked to the notes that explain each term.
- **Several languages**: one folder of notes per language, a language switch in the header, and the reader's language remembered.
- **Static hosting**: the site builds to plain files (`out/`) with search built in, so it runs on S3, Cloudflare Pages, GitHub Pages or any file host.
- **Last updated dates** from git.

## Start a site

```bash
npm create notestack@latest my-notes
cd my-notes
npm run dev
```

This copies a small starter app and installs it. The starter's files are a few lines each that call this package, so a new version reaches your site with:

```bash
npm update @yx-elite/notestack
```

The only code file you edit is `site.config.ts`: the site's name, links, accent colour and languages. Notes go in `content/docs/`.

## Import paths

| Import | What it holds |
| --- | --- |
| `@yx-elite/notestack` | Site config, root layout, layouts, landing page, components, language helpers |
| `@yx-elite/notestack/mdx` | `getMDXComponents()`: every component for MDX pages |
| `@yx-elite/notestack/source` | `notesSourcePlugins`: sidebar icons from frontmatter, for `lib/source.ts` |
| `@yx-elite/notestack/routes` | The docs page and the search, share-image and llms.txt routes. Server only |
| `@yx-elite/notestack/next` | `withNotestack()` for `next.config.mjs`: static export settings. No React |
| `@yx-elite/notestack/theme.css` | The theme. Import it after Tailwind |

Every export, what it does and which file uses it: [API reference](https://github.com/yx-elite/notestack/blob/main/playground/content/docs/en/api.mdx).

## Requirements

Notestack builds its own site with Next.js and Fumadocs MDX, as a static export. It doesn't plug into a Fumadocs app set up another way, such as one with a server, another framework or another content source.

- Node.js 22 or later (`engines` in `package.json`, so npm warns on an older one).
- Peer dependencies, which the package uses from your app so there is only ever one copy of each: `fumadocs-core` and `fumadocs-ui` 16.19.7 or later 16.x, `next` 16.4.6 or later 16.x, and `react` and `react-dom` 19.3.1 or later 19.x.
- For TypeScript: `@types/react` and `@types/mdx`, optional peer dependencies that the package's types use.
- Also in your app: `fumadocs-mdx` 15 and Tailwind CSS 4.

A site made with `npm create notestack` has all of these.

## Versions

The package follows [semver](https://semver.org). While it is `0.x`, a release that needs you to edit a file in your site bumps the minor version (`0.1` → `0.2`), and its entry in [CHANGELOG.md](https://github.com/yx-elite/notestack/blob/main/packages/notestack/CHANGELOG.md) lists the exact edit under *Migration*.

## License

MIT. An unofficial theme, not part of the Fumadocs project.
