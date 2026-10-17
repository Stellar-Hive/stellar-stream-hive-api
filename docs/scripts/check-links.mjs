#!/usr/bin/env node
// Checks that /docs links and #anchor links in page.mdx files resolve to a page and heading.
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DOCS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(DOCS_ROOT, "app", "docs");
const LINK = /\]\(([^)\s]+)\)/g;
const HEADING = /^#{1,6}\s+(.+?)\s*$/;

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

// Returns the page's lines with fenced code blocks removed.
function proseLines(text) {
  let inFence = false;
  return text.split("\n").map((line) => {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      return null;
    }
    return inFence ? null : line;
  });
}

// Approximates rehype-slug (github-slugger): lowercase, drop punctuation, spaces become hyphens.
function slugify(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}

function routeToFile(urlPath) {
  const segments = urlPath.replace(/^\/docs\/?/, "").split("/").filter(Boolean);
  return path.join(PAGES_DIR, ...segments, "page.mdx");
}

const pages = await findPages(PAGES_DIR);
const lines = new Map();
const anchors = new Map();

for (const file of pages) {
  const prose = proseLines(await readFile(file, "utf8"));
  lines.set(file, prose);
  anchors.set(
    file,
    new Set(prose.map((line) => line?.match(HEADING)?.[1]).filter(Boolean).map(slugify)),
  );
}

const broken = [];

for (const file of pages) {
  lines.get(file).forEach((line, index) => {
    if (line === null) return;
    for (const match of line.matchAll(LINK)) {
      const target = match[1];
      if (/^(https?:|mailto:)/.test(target)) continue;

      const [urlPath, hash = ""] = target.split("#");
      if (urlPath && !urlPath.startsWith("/docs")) continue;

      const targetFile = urlPath ? routeToFile(urlPath) : file;
      const where = `${path.relative(DOCS_ROOT, file)}:${index + 1}`;

      if (!anchors.has(targetFile)) {
        broken.push(`${where} -> ${target} (no page)`);
      } else if (hash && !anchors.get(targetFile).has(hash)) {
        broken.push(`${where} -> ${target} (no heading)`);
      }
    }
  });
}

if (broken.length > 0) {
  console.error(broken.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} pages: all internal links resolve.`);
}
