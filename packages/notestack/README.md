# @yx-elite/notestack

A [Fumadocs](https://fumadocs.dev) theme for study notes. It gives a notes site its layout, landing page, styles, components and static-export settings, so every site that uses it reads the same way and gets fixes through `npm update`.

> Not published yet. The way to start a site will be `npm create notestack@latest my-notes`.

## Import paths

| Import | What it holds |
| --- | --- |
| `@yx-elite/notestack` | Site config, layouts, landing page, components, page props |
| `@yx-elite/notestack/mdx` | `getMDXComponents()` for MDX pages |
| `@yx-elite/notestack/source` | Loader plugins and last-updated dates. Build time only |
| `@yx-elite/notestack/next` | `withNotestack()` for `next.config.mjs` |
| `@yx-elite/notestack/theme.css` | The theme. Import it after Tailwind in `app/global.css` |

Needs `fumadocs-core` and `fumadocs-ui` 16, `next` 16 and `react` 19 in your app.

## License

MIT. An unofficial theme, not part of the Fumadocs project.
