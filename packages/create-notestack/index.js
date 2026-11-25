#!/usr/bin/env node
// npm create notestack@latest my-notes
// Copies the starter into a new folder, names the site after the folder and installs it.
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const install = !args.includes("--no-install");
let folder = args.find((arg) => !arg.startsWith("--"));

// 1. The folder name: from the command, or ask for it
if (!folder) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  folder =
    (await rl.question("Folder for your notes site (my-notes): ")).trim() ||
    "my-notes";
  rl.close();
}

const target = resolve(folder);
const base = basename(target).trim();

// The npm package name: lower case letters, digits, "-", "_" and ".", and it can't
// start with "." or "_". A folder name with none of those ("笔记") gives "my-notes".
const slug =
  base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // "café" → "cafe"
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "") || "my-notes";

// The site's name: "networking-notes" → "Networking Notes". A folder name with other
// characters ("笔记", "Café Notes") is kept as it is.
const title = /^[\x20-\x7e]+$/.test(base)
  ? slug
      .split(/[-_.]+/)
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ")
  : base;

// 2. The folder may be new, empty, or a fresh clone: these files are fine to have.
// Anything else stops here, so nothing of the reader's is overwritten.
const harmless = new Set([
  ".git",
  ".gitattributes",
  ".gitignore",
  ".ds_store",
  "thumbs.db",
  ".idea",
  ".vscode",
  "license",
  "license.md",
  "license.txt",
  "readme.md",
]);
const existing = existsSync(target) ? readdirSync(target) : [];
const conflicts = existing.filter((name) => !harmless.has(name.toLowerCase()));
if (conflicts.length > 0) {
  console.error(
    `${folder} already has files that the new site could overwrite:\n${conflicts
      .map((name) => `  ${name}`)
      .join("\n")}\nMove them, or choose another folder.`,
  );
  process.exit(1);
}
const has = (name) => existing.some((entry) => entry.toLowerCase() === name);

// 3. Check the template before copying anything, so a broken copy of this
// command stops here instead of leaving a site with the wrong name
const template = fileURLToPath(new URL("./template", import.meta.url));
const siteName = "name: 'My Notes',";
if (!readFileSync(join(template, "site.config.ts"), "utf8").includes(siteName)) {
  console.error(
    "This version of create-notestack can't set the site name. Please report it at https://github.com/yx-elite/notestack/issues",
  );
  process.exit(1);
}

// Copy the starter. A README.md already in the folder is the reader's own, so it stays.
const keepReadme = has("readme.md");
cpSync(template, target, {
  recursive: true,
  filter: (source) =>
    !(keepReadme && source === join(template, "README.md")) &&
    source !== join(template, "gitignore"),
});

// .gitignore travels as "gitignore". With a .gitignore already in the folder,
// add only the starter's lines it doesn't have yet ("/out/" and "out" count as the same).
const ignoreLines = readFileSync(join(template, "gitignore"), "utf8");
const ignorePath = join(target, ".gitignore");
const mergeIgnore = has(".gitignore");
if (mergeIgnore) {
  const current = readFileSync(ignorePath, "utf8");
  const key = (line) => line.trim().replace(/^\/|\/$/g, "");
  const have = new Set(current.split(/\r?\n/).map(key));
  const missing = ignoreLines
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !have.has(key(line)));
  if (missing.length > 0) {
    writeFileSync(
      ignorePath,
      `${current}${current.endsWith("\n") || current === "" ? "" : "\n"}\n# Notestack\n${missing.join("\n")}\n`,
    );
  }
} else {
  writeFileSync(ignorePath, ignoreLines);
}

// 4. package.json: the site's own name, and the theme version that matches this command
const own = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);
const pkgPath = join(target, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = slug;
pkg.dependencies['@yx-elite/notestack'] = `^${own.version}`;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

// 5. site.config.ts: the site's name, from the folder name
const configPath = join(target, "site.config.ts");
writeFileSync(
  configPath,
  readFileSync(configPath, "utf8").replace(
    siteName,
    () => `name: '${title.replace(/[\\']/g, "\\$&")}',`,
  ),
);

console.log(`\nCreated ${title} in ${target}`);
if (keepReadme) console.log("Kept your README.md.");
if (mergeIgnore) console.log("Added the site's build folders to your .gitignore.");

// 6. Install the packages (skip with --no-install)
if (install) {
  console.log("Installing packages, this takes a minute…\n");
  const result = spawnSync("npm", ["install"], {
    cwd: target,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    console.error(`\nnpm install failed. Run it yourself inside ${folder}.`);
    process.exit(1);
  }
}

// 7. What to do next (no "cd" when the site is in the current folder)
const steps = [
  ...(target === process.cwd() ? [] : [`cd ${folder}`]),
  ...(install ? [] : ["npm install"]),
  "npm run dev",
];
console.log(`
Next:
${steps.map((step) => `  ${step}`).join("\n")}

Then open http://localhost:3000, edit site.config.ts and write notes in content/docs/.`);
