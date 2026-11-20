#!/usr/bin/env node
// Checks that every app/docs/**/page.mdx exports a `metadata` object whose
// `title` and `description` are non-empty string literals (CONTRIBUTING.md).
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DOCS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(DOCS_ROOT, "app", "docs");
const REQUIRED_FIELDS = ["title", "description"];
const METADATA_START = /export\s+const\s+metadata\s*=\s*\{/;
// A string literal: "...", '...' or `...` (no interpolation), with escapes.
const STRING_LITERAL = /^(?:"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`)$/;

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

// Returns the source of the object literal following `export const metadata =`,
// from its opening brace to the matching closing brace, or null if absent.
// Braces inside string literals are skipped.
function extractMetadataObject(text) {
  const match = METADATA_START.exec(text);
  if (!match) return null;
  const start = match.index + match[0].length - 1;
  let depth = 0;
  let quote = null;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

// Reads the top-level `key: value` pairs of the metadata object. Values are
// captured up to the next top-level comma or the closing brace.
function readFields(objectSource) {
  const body = objectSource.slice(1, -1);
  const fields = new Map();
  let depth = 0;
  let quote = null;
  let current = "";
  const pieces = [];
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (quote) {
      current += ch;
      if (ch === "\\") {
        current += body[++i] ?? "";
      } else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    if (ch === "{" || ch === "[" || ch === "(") depth++;
    if (ch === "}" || ch === "]" || ch === ")") depth--;
    if (ch === "," && depth === 0 && !quote) {
      pieces.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  pieces.push(current);

  for (const piece of pieces) {
    const idx = piece.indexOf(":");
    if (idx === -1) continue;
    const key = piece.slice(0, idx).trim();
    const value = piece.slice(idx + 1).trim();
    fields.set(key, value);
  }
  return fields;
}

function problemsFor(file, text) {
  const where = path.relative(DOCS_ROOT, file);
  const object = extractMetadataObject(text);
  if (object === null) {
    return [`${where}: missing \`export const metadata = { ... }\``];
  }

  const fields = readFields(object);
  const problems = [];
  for (const field of REQUIRED_FIELDS) {
    if (!fields.has(field)) {
      problems.push(`${where}: metadata.${field} is missing`);
      continue;
    }
    const literal = fields.get(field).match(STRING_LITERAL);
    if (!literal) {
      problems.push(`${where}: metadata.${field} must be a string literal`);
      continue;
    }
    const content = literal.slice(1).find((group) => group !== undefined) ?? "";
    if (content.trim() === "") {
      problems.push(`${where}: metadata.${field} is empty`);
    }
  }
  return problems;
}

const pages = await findPages(PAGES_DIR);
const problems = [];
for (const file of pages) {
  problems.push(...problemsFor(file, await readFile(file, "utf8")));
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} pages: every page exports metadata with a title and description.`);
}
