#!/usr/bin/env node
// Checks that the sidebar in lib/nav.ts and the doc pages under app/docs agree:
// every app/docs/**/page.mdx has a nav entry, and every nav href has a page.
// CONTRIBUTING.md: a page missing from nav.ts is reachable but unlisted, and a
// nav entry pointing at a deleted page would 404.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DOCS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(DOCS_ROOT, "app", "docs");
const NAV_FILE = path.join(DOCS_ROOT, "lib", "nav.ts");
const HREF = /\bhref\s*:\s*"([^"]*)"/g;

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

function navHrefs(source) {
  return [...source.matchAll(HREF)].map((match) => match[1]);
}

const pages = (await findPages(PAGES_DIR)).map(routeFor).sort();
const hrefs = navHrefs(await readFile(NAV_FILE, "utf8"));
const pageSet = new Set(pages);
const navSet = new Set(hrefs);

const problems = [];

const duplicates = hrefs.filter((href, index) => hrefs.indexOf(href) !== index);
for (const href of new Set(duplicates)) {
  problems.push(`lib/nav.ts: ${href} appears more than once`);
}
for (const page of pages) {
  if (!navSet.has(page)) {
    problems.push(`${page} has a page.mdx but no entry in lib/nav.ts (unreachable from the sidebar)`);
  }
}
for (const href of navSet) {
  if (!pageSet.has(href)) {
    problems.push(`lib/nav.ts: ${href} has no page.mdx under app/docs (would 404)`);
  }
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} pages against ${navSet.size} nav entries: they agree.`);
}
