# create-notestack

Creates a new [Notestack](https://github.com/yx-elite/notestack) study-notes site.

```bash
npm create notestack@latest my-notes
cd my-notes
npm run dev
```

Then open http://localhost:3000, edit `site.config.ts` and write your notes in `content/docs/`.

## What it does

1. Copies the Notestack starter into a new folder (`my-notes` above). Leave the name out and it asks.
2. Names the site after the folder: `stock-trading-notes` becomes "Stock Trading Notes".
3. Runs `npm install`. Add `--no-install` to skip it.

It never writes into a folder that already has files in it.

Needs Node.js 22 or later.

## License

MIT
