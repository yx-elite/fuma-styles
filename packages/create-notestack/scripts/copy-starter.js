// Copies starter/ into template/, the folder this package ships.
// Runs before every `npm pack` and `npm publish` (the "prepack" script).
import { cpSync, renameSync, rmSync } from "node:fs";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";

const starter = fileURLToPath(new URL("../../../starter", import.meta.url));
const template = fileURLToPath(new URL("../template", import.meta.url));

// Made on your computer by installs and builds; never part of a new site
const skip = new Set([
  "node_modules",
  ".next",
  "out",
  ".source",
  "next-env.d.ts",
]);

rmSync(template, { recursive: true, force: true });
cpSync(starter, template, {
  recursive: true,
  filter: (source) =>
    !skip.has(basename(source)) && !source.endsWith(".tsbuildinfo"),
});

// npm leaves .gitignore files out of published packages, so it travels as "gitignore"
renameSync(`${template}/.gitignore`, `${template}/gitignore`);

console.log("Copied starter/ into template/");
