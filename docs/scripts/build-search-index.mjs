#!/usr/bin/env node
// Builds public/search-index.json for the header search box: one entry per
// page (from lib/nav.ts) plus one per heading in each page.mdx, so results can
// link straight to a heading anchor. Runs before `next build` (prebuild).
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slugify } from "./slugify.mjs";

const DOCS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(DOCS_ROOT, "app", "docs");
const NAV_FILE = path.join(DOCS_ROOT, "lib", "nav.ts");
const OUT_FILE = path.join(DOCS_ROOT, "public", "search-index.json");
const HEADING = /^(#{1,6})\s+(.+?)\s*$/;
const NAV_ITEM = /title:\s*"([^"]*)",\s*href:\s*"([^"]*)",\s*description:\s*"((?:[^"\\]|\\.)*)"/g;

async function findPages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await findPages(full)));
    else if (entry.name === "page.mdx") files.push(full);
  }
  return files;
}

// app/docs/contracts/stream/page.mdx -> /docs/contracts/stream
function routeFor(file) {
  const relative = path.relative(PAGES_DIR, path.dirname(file)).split(path.sep).join("/");
  return relative === "" ? "/docs" : `/docs/${relative}`;
}

// Headings outside fenced code blocks, with inline markdown stripped.
function headings(text) {
  let inFence = false;
  const found = [];
  for (const line of text.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = HEADING.exec(line);
    if (!match) continue;
    const title = match[2]
      .replace(/`([^`]*)`/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_]/g, "")
      .trim();
    if (title) found.push({ title, anchor: slugify(title) });
  }
  return found;
}

const navSource = await readFile(NAV_FILE, "utf8");
const navItems = [...navSource.matchAll(NAV_ITEM)].map((match) => ({
  title: match[1],
  href: match[2],
  description: match[3].replace(/\\"/g, '"'),
}));
const navByHref = new Map(navItems.map((item) => [item.href, item]));

const entries = [];
for (const file of await findPages(PAGES_DIR)) {
  const href = routeFor(file);
  const navItem = navByHref.get(href);
  const pageTitle = navItem?.title ?? href;
  entries.push({ title: pageTitle, href, section: "", description: navItem?.description ?? "" });
  for (const heading of headings(await readFile(file, "utf8"))) {
    entries.push({
      title: heading.title,
      href: `${href}#${heading.anchor}`,
      section: pageTitle,
      description: "",
    });
  }
}

await mkdir(path.dirname(OUT_FILE), { recursive: true });
await writeFile(OUT_FILE, `${JSON.stringify(entries, null, 2)}\n`);
console.log(`search index: ${entries.length} entries -> ${path.relative(DOCS_ROOT, OUT_FILE)}`);
