# playground

The docs site for `@yx-elite/notestack`. It is deployed publicly as the theme's reference: installation and setup guides, migration notes, and a showcase page for every element the theme styles.

It is also where the theme is tested. It uses the package the same way a notes site does, through `@yx-elite/notestack` in `package.json` (npm workspaces link it to `packages/notestack/`).

- `content/docs/`: the docs pages (MDX).
- `public/vault/`: a small Obsidian vault, shown under *Showcase*.
- `kit/`: React code that is still being designed. It moves into the package; see `PRD.md` (*Design phase*).
- `site.config.ts`: the site's settings, the same file every notes site has.

Run it from the **repo root**, not from this folder:

```bash
npm run dev        # http://localhost:3000
npm run build      # static export into playground/out/
```

See the [root README](../README.md) for how this fits in.
