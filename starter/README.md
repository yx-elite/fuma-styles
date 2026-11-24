# My Notes

Study notes written in Markdown and published as a static website, made with [Notestack](https://github.com/yx-elite/notestack) (a theme for [Fumadocs](https://fumadocs.dev)).

## Run it

You need [Node.js](https://nodejs.org) 22 or later.

```bash
npm install     # once, after cloning
npm run dev     # the site at http://localhost:3000, updating as you save
```

## Write

| What | Where |
| --- | --- |
| Notes | `content/docs/`, one `.mdx` file per page |
| Sidebar order and sections | `meta.json` in each folder |
| Glossary terms | `content/glossary.json` |
| Site name, links, colour | `site.config.ts` |

Everything else (`app/`, `lib/`, the config files) is a few lines that load the theme. You don't need to edit it.

## Publish

```bash
npm run build   # the whole site as plain files in out/
npm start       # look at out/ locally before you upload it
```

Upload `out/` to any static host. The Notestack docs have step-by-step guides for each one.

## Update the theme

```bash
npm update @yx-elite/notestack
```

New versions bring fixes and new features. A version that needs you to change a file says so in the [changelog](https://github.com/yx-elite/notestack/blob/main/packages/notestack/CHANGELOG.md), with the exact edit.
