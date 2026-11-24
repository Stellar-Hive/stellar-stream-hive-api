"use client";

import { isValidElement, useState, type ReactElement, type ReactNode } from "react";

/** Friendly names for common fence languages. Anything not listed falls back to the raw fence value. */
const LANGUAGE_LABELS: Record<string, string> = {
  bash: "Shell",
  sh: "Shell",
  shell: "Shell",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  javascript: "JavaScript",
  rs: "Rust",
  rust: "Rust",
  json: "JSON",
  toml: "TOML",
  yaml: "YAML",
  yml: "YAML",
  text: "Text",
  txt: "Text",
};

/** Returns the display label for a fence language, or the raw value when there is no friendly name. */
function languageLabel(language: string): string {
  return LANGUAGE_LABELS[language.toLowerCase()] ?? language;
}

/** Recursively flattens MDX-rendered code children back into plain text for the copy button. */
function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return extractText(props.children);
  }
  return "";
}

/**
 * Parses a `{2,4-6}` line spec into a set of 1-based line numbers. Malformed
 * entries are ignored rather than throwing, so a typo never breaks the build.
 */
function parseHighlight(spec: string | undefined): Set<number> {
  const lines = new Set<number>();
  if (!spec) return lines;
  for (const part of spec.split(",")) {
    const range = /^(\d+)(?:-(\d+))?$/.exec(part.trim());
    if (!range) continue;
    const start = Number(range[1]);
    const end = range[2] ? Number(range[2]) : start;
    if (start < 1 || end < start) continue;
    for (let line = start; line <= end; line += 1) lines.add(line);
  }
  return lines;
}

/**
 * Replaces MDX's default `<pre>` rendering for fenced code blocks. MDX passes the
 * fenced block's language as a `language-xxx` class on the inner `<code>` element
 * (e.g. ` ```rust ` produces `<code class="language-rust">`), which we surface as
 * a small label, plus a copy-to-clipboard button.
 *
 * A fence meta string of the form `title="..."` (e.g. ` ```ts title="api/src/main.rs" `)
 * is lifted onto the `<pre>` as `data-title` by `lib/rehype-code-title.mjs` and shown
 * in the header next to the language label.
 *
 * A fence meta string of the form `{2,4-6}` (e.g. ` ```rust {2,4-6} `) is lifted
 * onto the `<pre>` as `data-highlight` by the same plugin and highlights those
 * 1-based lines. Highlighting is purely visual: the copy button still copies the
 * plain text extracted from the code children.
 */
export default function CodeBlock(props: {
  children?: ReactNode;
  "data-title"?: string;
  "data-highlight"?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { children, "data-title": title, "data-highlight": highlight, ...rest } = props;

  const codeElement = isValidElement(children) ? (children as ReactElement<{ className?: string; children?: ReactNode }>) : null;
  const className = codeElement?.props.className ?? "";
  const match = /language-(\w+)/.exec(className);
  const language = match?.[1] ?? "text";
  const label = languageLabel(language);
  const text = extractText(children).replace(/\n$/, "");
  const highlighted = parseHighlight(highlight);
  const codeLines = highlighted.size > 0 ? text.split("\n") : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. non-secure context) -- the code block
      // remains fully selectable by hand, so this is a silent no-op.
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-1.5">
        <span className="flex min-w-0 items-center gap-2">
          {title ? (
            <span className="truncate text-xs font-medium text-slate-200" title={title}>
              {title}
            </span>
          ) : null}
          <span className="shrink-0 text-xs font-medium text-slate-400">{label}</span>
        </span>
        <button
          type="button"
          aria-label="Copy code"
          onClick={handleCopy}
          className="rounded px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? "Code copied to clipboard" : ""}
        </span>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-slate-100" {...rest}>
        {codeLines ? (
          <code>
            {codeLines.map((line, index) => (
              <span
                key={index}
                className={
                  highlighted.has(index + 1)
                    ? "block bg-slate-800/70"
                    : "block"
                }
              >
                {line || " "}
              </span>
            ))}
          </code>
        ) : (
          children
        )}
      </pre>
    </div>
  );
}
