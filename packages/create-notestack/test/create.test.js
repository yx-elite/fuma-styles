// What `npm create notestack` does to a folder, run the way npm runs it:
// a fresh template copied from starter/, then index.js in a scratch folder.
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (...path) => readFileSync(join(...path), "utf8");
const own = JSON.parse(read(root, "package.json"));

before(() => {
  const copy = spawnSync(process.execPath, [join(root, "scripts/copy-starter.js")]);
  assert.equal(copy.status, 0, String(copy.stderr));
});

/** Runs the command in a new scratch folder; `setup` adds files there first */
function create(folder, setup = () => {}) {
  const cwd = mkdtempSync(join(tmpdir(), "create-notestack-"));
  setup(cwd);
  const run = spawnSync(process.execPath, [join(root, "index.js"), folder, "--no-install"], {
    cwd,
    encoding: "utf8",
  });
  const site = join(cwd, folder);
  return { ...run, site, siteName: () => /^\s*name: '(.*)',$/m.exec(read(site, "site.config.ts"))?.[1] };
}

const packageName = (site) => JSON.parse(read(site, "package.json")).name;

describe("names", () => {
  for (const [folder, name, title] of [
    ["networking-notes", "networking-notes", "Networking Notes"],
    ["笔记", "my-notes", "笔记"],
    ["Café Notes", "cafe-notes", "Café Notes"],
    ["_drafts", "drafts", "Drafts"],
  ]) {
    it(`${folder} → ${name}, "${title}"`, () => {
      const run = create(folder);
      assert.equal(run.status, 0, run.stderr);
      assert.equal(packageName(run.site), name);
      assert.equal(run.siteName(), title);
    });
  }

  it("keeps quotes in the site name valid TypeScript", () => {
    const run = create("Café's notes");
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.siteName(), "Café\\'s notes");
  });
});

describe("a new folder", () => {
  it("gets the starter, a .gitignore, and the theme at this command's version", () => {
    const run = create("my-notes");
    assert.equal(run.status, 0, run.stderr);
    assert.ok(existsSync(join(run.site, ".gitignore")));
    assert.ok(!existsSync(join(run.site, "gitignore")));
    assert.ok(existsSync(join(run.site, "README.md")));
    assert.equal(JSON.parse(read(run.site, "package.json")).dependencies["@yx-elite/notestack"], `^${own.version}`);
    assert.match(run.stdout, /cd my-notes/);
  });
});

describe("the current folder", () => {
  it("accepts a fresh clone, keeps its README and LICENSE, and merges its .gitignore", () => {
    const run = create(".", (cwd) => {
      mkdirSync(join(cwd, ".git"));
      writeFileSync(join(cwd, "README.md"), "# mine\n");
      writeFileSync(join(cwd, "LICENSE"), "MIT\n");
      writeFileSync(join(cwd, ".gitignore"), "node_modules/\nout");
    });
    assert.equal(run.status, 0, run.stderr);
    assert.equal(read(run.site, "README.md"), "# mine\n");
    assert.equal(read(run.site, "LICENSE"), "MIT\n");
    const ignore = read(run.site, ".gitignore");
    assert.match(ignore, /^node_modules\/\nout\n\n# Notestack\n/);
    assert.match(ignore, /^\.source$/m);
    assert.doesNotMatch(ignore, /^\/out\/$/m, "out is already ignored");
    assert.doesNotMatch(run.stdout, /cd \./);
  });

  it("stops before writing anything when other files are there", () => {
    const run = create(".", (cwd) => writeFileSync(join(cwd, "package.json"), "{}"));
    assert.equal(run.status, 1);
    assert.match(run.stderr, /package\.json/);
    assert.deepEqual(readdirSync(run.site), ["package.json"]);
  });
});

it("has the same version as @yx-elite/notestack, which it installs", () => {
  const theme = JSON.parse(read(root, "../notestack/package.json"));
  assert.equal(own.version, theme.version);
});
