#!/usr/bin/env node
// Copiază numai proiectul platforma într-un repository separat, fără publicare.
import { cpSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, resolve, relative, basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "..");
if (!process.argv[2])
  throw new Error(
    "Utilizare: node platforma/github-pages/prepare-project.mjs /cale/repository-platforma",
  );
const target = resolve(process.argv[2]);
if (target === source || target.startsWith(source + "/"))
  throw new Error(
    "Destinația trebuie să fie în afara folderului sursă platforma.",
  );
if (existsSync(target) && readdirSync(target).some((name) => name !== ".git"))
  throw new Error(
    "Destinația trebuie să fie goală sau un repository nou, fără fișiere.",
  );
const omitted = new Set([
  "node_modules",
  "dist",
  "dist-pages",
  "test-results",
  "playwright-report",
  ".git",
  ".DS_Store",
]);
mkdirSync(target, { recursive: true });
cpSync(source, target, {
  recursive: true,
  filter: (path) =>
    !relative(source, path)
      .split("/")
      .some((part) => omitted.has(part)) &&
    !basename(path).startsWith(".env") &&
    !path.endsWith(".patch"),
});
if (!existsSync(join(target, ".github/workflows/pages.yml")))
  throw new Error("Lipsește workflow-ul Pages.");
console.log(
  `Proiect pregătit în ${target}. Nu s-a făcut commit, push sau deploy.`,
);
