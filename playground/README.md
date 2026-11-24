# playground

The docs site for `notestack`. Once deployed, it is the theme's public reference: installation and setup guides, migration notes, and a showcase page for every element the theme styles.

It is also where the theme is tested. It uses the package the same way a notes site does, through `notestack` in `package.json` (npm workspaces link it to `packages/notestack/`).

- `content/docs/en/`, `content/docs/zh-CN/`: the docs pages (MDX), one folder per language. A page missing in Chinese shows in English.
- `app/[lang]/`: every page, once per language. `app/(root)/` holds only `/`, which sends readers to their language.
- `app/`, `lib/`: thin files that import from the package, the same shape a notes site will have.
- `site.config.ts`: the site's settings, the same file every notes site has.

Run it from the **repo root**, not from this folder:

```bash
npm run dev        # http://localhost:3000
npm run build      # static export into playground/out/
```

See the [root README](../README.md) for how this fits in.
