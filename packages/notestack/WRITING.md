# Writing notes with Notestack

This guide is for an AI agent (Claude Code, Cursor, Codex and others) that writes or edits notes in a site built with `@yx-elite/notestack`. It ships inside the package, so `npm update` keeps it in step with the theme. Read it before you write a note.

A Notestack site is a [Fumadocs](https://fumadocs.dev) site with the Notestack theme on top. This guide covers what Notestack adds and how its sites are written. For anything it doesn't cover, read the Notestack docs' index, [notestack.yxelite.dev/llms.txt](https://notestack.yxelite.dev/llms.txt), then [fumadocs.dev/llms.txt](https://fumadocs.dev/llms.txt) for Fumadocs itself. Both list every docs page as Markdown: open only the pages you need.

## What you may change

| Path | What it holds | Edit it? |
| --- | --- | --- |
| `content/docs/` | The notes: `.mdx` files and `meta.json` | Yes |
| `content/glossary.json` | The glossary's terms | Yes |
| `public/` | Images and files several notes share | Yes |
| `site.config.ts` | The site's name, description, repo, links, accent and languages | Only when asked |
| `app/`, `lib/`, `next.config.mjs`, other config files | A few lines each that call the package | No |

The files in `app/` and `lib/` are glue: every layout, style and route comes from the package. Don't add styles, components or logic there, and don't add dependencies. If a note needs something the theme can't do, say so instead of building it into the site.

## Pages

Each `.mdx` file in `content/docs/` is one page, and its path is its address: `content/docs/networking/vpc.mdx` is `/docs/networking/vpc`. Name files in lowercase with hyphens (`dns-records.mdx`). Keep `content/docs/index.mdx`, because the landing page's *Start reading* button opens it.

Every page starts with frontmatter:

```md
---
title: VPC
description: Private networks, subnets and routing.
icon: Network
---
```

| Field | Needed | What it does |
| --- | --- | --- |
| `title` | Yes | The page heading, the sidebar entry, the browser tab and the search result |
| `description` | No, but write one | One sentence under the title. Search, the landing page and link previews show it |
| `icon` | No | A sidebar icon: a [Lucide](https://lucide.dev/icons) name in PascalCase, such as `Network` |
| `full` | No | `full: true` uses the whole width and hides *On this page*, for wide tables or diagrams |

Don't repeat the title as a `#` heading: the theme shows it. Start the body with `##` headings, which make up *On this page*. Use `###` below them, and no deeper.

## The sidebar

A folder's `meta.json` sets the order of its pages:

```json
{
  "title": "Networking",
  "icon": "Network",
  "pages": ["index", "vpc", "dns-records", "..."]
}
```

| Entry | What it does |
| --- | --- |
| `"vpc"` | A page or folder, by its file name without `.mdx` |
| `"---Notes---"` | A section heading. On the landing page, each section becomes a card |
| `"...example"` | The pages of the `example` folder, placed here without the folder |
| `"..."` | Every page not listed elsewhere, A to Z |
| `"!drafts"` | Leaves `drafts` out |

When you add a page, check the folder's `meta.json`. If it lists its pages and has no `"..."`, add the new page's name, or it won't show.

## Links

Link to another note by its address or its file: `[subnets](/docs/networking/vpc#subnets)` or `[subnets](./vpc.mdx#subnets)`. A heading's anchor is its text in lowercase with hyphens: `## Route tables` is `#route-tables`. On a site with several languages, still write `/docs/…`. The theme adds the page's language.

## Components

Notes use these without an import.

### Callout

A few lines set apart in a coloured box. The icon and title sit in a pill at the top.

```mdx
<Callout type="warn" title="Costs money">
A NAT gateway is billed per hour, even when nothing uses it.
</Callout>
```

| `type` | For |
| --- | --- |
| `info` (default) | Background facts and side notes |
| `idea` | A tip, a shortcut, a better way |
| `success` | A confirmed result or good practice |
| `warn` | Something that costs money or causes trouble |
| `error` | Something that loses data or can't be undone |

- `title`: a few words, shown in capitals. Without it, the pill shows the type's name. `title={false}` drops the pill for a one-line aside.
- `icon`: a Lucide name, such as `icon="GraduationCap"`. An unknown name falls back to the type's icon.
- `color`: `accent`, `blue`, `teal`, `green`, `purple`, `pink`, `orange`, `red` or `slate`. Each has a shade for light and dark mode. Prefer these to CSS colours.

Rules:

- Keep `warn` and `error` rare, so they still stand out.
- Give each kind of note one colour and one icon across the whole site, such as `color="purple" icon="GraduationCap"` for every exam tip. Before you add a new kind, search the notes for callouts already in use and reuse their `title`, `icon` and `color`.
- A callout holds a few sentences, a short list or a code block. Longer material belongs in the page itself.

### Steps

For a procedure the reader follows in order. Each step starts with a `###` heading:

```mdx
<Steps>
  <Step>
    ### Create the bucket

    Name it after the domain.
  </Step>
  <Step>
    ### Turn on website hosting

    Set the index document to `index.html`.
  </Step>
</Steps>
```

### Tabs

For one thing shown several ways, such as per operating system. `value` must match an entry in `items`:

```mdx
<Tabs items={['macOS', 'Windows']}>
  <Tab value="macOS">`brew install awscli`</Tab>
  <Tab value="Windows">`winget install Amazon.AWSCLI`</Tab>
</Tabs>
```

### Collapsible sections

- `<details><summary>Show the answer</summary>…</details>` for one hidden part. Leave an empty line after `</summary>` and before `</details>`, or Markdown inside shows as plain text.
- `<Accordions>` with `<Accordion title="…">` for a group, such as practice questions. `id="stale-data"` lets a link open that panel. `<Accordions type="multiple">` keeps several open.

### Cards

Links shown as cards, for "next steps" or an overview of a section. `icon` takes a Lucide name and shows in a tile in the top-left corner:

```mdx
<Cards>
  <Card icon="Network" title="VPC" href="/docs/networking/vpc" description="Private networks and subnets." />
  <Card icon="Globe" title="DNS" href="/docs/networking/dns" description="How names become addresses." />
</Cards>
```

Give every card in a group an icon, or none of them.

### Files and TypeTable

`<Files>`, `<Folder name="…">` and `<File name="…">` draw a file tree. `<TypeTable type={{ … }} />` lists options with types and defaults. Both come from Fumadocs. See its docs through the llms.txt link above.

## Images

- Put an image only one note uses next to the note (`./vpc.png`). Put shared images in `public/` and link them from the root (`/diagrams/request-path.svg`).
- Always write alt text: `![A VPC with two subnets](./vpc.png)`. Say what the image shows.
- An image with a transparent background needs a light and a dark version. Name them `name.light.svg` and `name.dark.svg` (also `.png` and `.jpg`) and place both, one after the other. The theme shows the one that matches the reader's mode.
- For a caption, wrap the image in `<figure>` and add `<figcaption>`, with empty lines around the image.
- Readers can click any image to zoom. For a very wide diagram, set `full: true` in the frontmatter.

## Glossary

Terms live in `content/glossary.json`:

```json
{ "term": "Subnet", "definition": "A range of addresses inside a VPC.", "href": "/docs/networking/vpc#subnets", "label": "VPC" }
```

`term` and `definition` are required. `href` links to the note that explains the term, and `label` is that link's text. Link to a term with `/docs/glossary#term-` and the term in lowercase with hyphens: `#term-route-table`. When a note introduces a term, add it to the glossary and link the first mention.

## Code

Fence code with its language (`bash`, `ts`, `json`). Add `title="lib/source.ts"` after the language to show a file name. Fumadocs' Markdown guide covers line highlights, code tabs and `npm` blocks.

## Several languages

On a site with `languages` in `site.config.ts`, notes live in one folder per language: `content/docs/en/…` and `content/docs/zh-CN/…`, with the same file names in each. A page missing in one language shows the default language's version. Translate a page by copying its file into the other folder, with the same name.

## Writing style

- Plain words and short sentences. One idea per sentence.
- Say what something is or does before how it works.
- Use the real names: the service, the command, the file path. Put code, commands and paths in backticks.
- Use a table to compare things, a numbered list for steps in order, and bullets for everything else.
- No filler and no marketing words. Cut "simply", "just" and "very".
- Match the notes already in the site: look at two or three nearby pages before you write, and follow their headings, callouts and tone.

## Before you finish

- Every new page has `title` and `description`, and appears in the sidebar.
- Links point to pages and headings that exist.
- Run `npm run build`. It fails on a broken MDX tag or a missing image, and it must pass.

More detail on every part is in the Notestack docs: <https://notestack.yxelite.dev/en/docs/>. For an agent, [notestack.yxelite.dev/llms.txt](https://notestack.yxelite.dev/llms.txt) lists every page of them as Markdown: open only the pages you need.
