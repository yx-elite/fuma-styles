#!/usr/bin/env node
// npm create notestack@latest my-notes
// Copies the starter into a new folder, names the site after the folder and installs it.
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
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
const slug = basename(target)
  .toLowerCase()
  .replace(/[^a-z0-9._-]+/g, "-");
const title = slug
  .split(/[-_.]+/)
  .filter(Boolean)
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(" ");

// 2. Never write into a folder that already has files in it
if (existsSync(target) && readdirSync(target).length > 0) {
  console.error(
    `${folder} already exists and isn't empty. Choose another name.`,
  );
  process.exit(1);
}

// 3. Copy the starter, and give .gitignore its real name back
const template = fileURLToPath(new URL("./template", import.meta.url));
cpSync(template, target, { recursive: true });
renameSync(join(target, "gitignore"), join(target, ".gitignore"));

// 4. package.json: the site's own name, and the theme version that matches this command
const own = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);
const pkgPath = join(target, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = slug;
pkg.dependencies['@yx-elite/notestack'] = `^${own.version}`;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

// 5. site.config.ts: the site's name, from the folder name ("my-notes" → "My Notes")
const configPath = join(target, "site.config.ts");
writeFileSync(
  configPath,
  readFileSync(configPath, "utf8").replace(
    "name: 'My Notes',",
    `name: '${title}',`,
  ),
);

console.log(`\nCreated ${title} in ${target}`);

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

// 7. What to do next
console.log(`
Next:
  cd ${folder}${install ? "" : "\n  npm install"}
  npm run dev

Then open http://localhost:3000, edit site.config.ts and write notes in content/docs/.`);
