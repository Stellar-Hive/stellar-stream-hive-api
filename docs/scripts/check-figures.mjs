#!/usr/bin/env node
// Checks that every <Figure> in a docs page.mdx has a non-empty `description`.
//
// `description` is the prop that carries a figure's explanatory text (see
// components/Figure.tsx); it is rendered into the caption that the figure's
// accessible name is built from. Fails with a list of offending locations.
//
// Usage: node scripts/check-figures.mjs [pagesDir]
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DOCS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(DOCS_ROOT, "app", "docs");

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

// Replaces fenced code blocks with blank lines so examples in code are ignored.
// Line numbers are preserved so error messages point at the right place.
function stripFences(text) {
  let inFence = false;
  return text
    .split("\n")
    .map((line) => {
      if (line.trimStart().startsWith("```")) {
        inFence = !inFence;
        return "";
      }
      return inFence ? "" : line;
    })
    .join("\n");
}

// Finds each opening <Figure ...> tag and returns its attribute text plus the
// line it starts on. Scans character by character so that `>` inside a quoted
// string or a {...} expression does not end the tag early.
function findFigureTags(text) {
  const tags = [];
  const opener = /<Figure(?=[\s/>])/g;
  let match;
  while ((match = opener.exec(text)) !== null) {
    let i = match.index + match[0].length;
    let quote = null;
    let depth = 0;
    const start = i;
    for (; i < text.length; i++) {
      const ch = text[i];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        depth--;
      } else if (ch === ">" && depth === 0) {
        break;
      }
    }
    const attrs = text.slice(start, i).replace(/\/\s*$/, "");
    const line = text.slice(0, match.index).split("\n").length;
    tags.push({ attrs, line });
  }
  return tags;
}

// Returns true when the `description` attribute is present and non-empty.
function hasDescription(attrs) {
  const quoted = attrs.match(/\bdescription\s*=\s*(["'])(.*?)\1/s);
  if (quoted) return quoted[2].trim().length > 0;

  const expression = attrs.match(/\bdescription\s*=\s*\{/);
  if (expression) {
    // Take the text between the outer braces and treat literal empties as missing.
    const open = expression.index + expression[0].length - 1;
    let depth = 0;
    for (let i = open; i < attrs.length; i++) {
      if (attrs[i] === "{") depth++;
      else if (attrs[i] === "}" && --depth === 0) {
        const inner = attrs.slice(open + 1, i).trim();
        return !["", '""', "''", "``", "undefined", "null"].includes(inner);
      }
    }
  }
  return false;
}

const files = await findPages(PAGES_DIR);
const failures = [];
let figureCount = 0;

for (const file of files) {
  const text = stripFences(await readFile(file, "utf8"));
  for (const { attrs, line } of findFigureTags(text)) {
    figureCount++;
    if (!hasDescription(attrs)) {
      failures.push(`${path.relative(DOCS_ROOT, file)}:${line} -> <Figure> is missing a non-empty description`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${files.length} pages and ${figureCount} figures: all have alt text.`);
}
