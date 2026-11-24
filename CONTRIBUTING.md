# Contributing

Ideas, bug reports and pull requests are welcome.

- **A bug or an idea:** [open an issue](https://github.com/yx-elite/notestack/issues) with what you expected, what happened, and a screenshot if it's visual (say which browser, and light or dark mode).
- **A change:** for anything bigger than a small fix, open an issue first so we can agree on the approach.

## Set up

```bash
git clone https://github.com/yx-elite/notestack.git
cd notestack
npm install
npm run dev -w notestack   # terminal 1: recompiles the package on save
npm run dev                          # terminal 2: the docs site at localhost:3000
```

`npm run dev:starter` runs the starter at localhost:3001 instead.

## Before you open a pull request

```bash
npm run typecheck
npm run build
```

Both must pass. Check the change in light and dark mode, at phone width, and in Safari if it animates anything. Add a line to `packages/notestack/CHANGELOG.md` under *Unreleased* for anything a site would notice.

The rules for the code are in [AGENTS.md](AGENTS.md); the most important is that logic goes in the package and the starter stays a few lines per file. The docs site has the same guide with more detail: [Contributing](https://github.com/yx-elite/notestack/blob/main/playground/content/docs/en/contributing.mdx), and what comes next is in [Roadmap](https://github.com/yx-elite/notestack/blob/main/playground/content/docs/en/roadmap.mdx).
