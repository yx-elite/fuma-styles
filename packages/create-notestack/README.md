# create-notestack

Creates a new [Notestack](https://github.com/yx-elite/notestack) study-notes site.

```bash
npm create notestack@latest my-notes
cd my-notes
npm run dev
```

Then open http://localhost:3000, edit `site.config.ts` and write your notes in `content/docs/`.

## What it does

1. Copies the Notestack starter into a new folder (`my-notes` above). Leave the name out and it asks. Use `.` for the folder you're in.
2. Names the site after the folder: `networking-notes` becomes "Networking Notes". A folder name in another script, such as `笔记`, is kept as the site name, and the npm package name falls back to `my-notes`.
3. Runs `npm install`. Add `--no-install` to skip it.

The folder can already hold `.git`, `.gitattributes`, `.gitignore`, `README.md`, `LICENSE`, `.DS_Store`, `.idea` and `.vscode`, as a repository fresh from GitHub does. Your `README.md` stays, and the starter's lines are added to your `.gitignore`. Any other file stops the command before it writes anything.

Needs Node.js 22 or later.

## License

MIT
