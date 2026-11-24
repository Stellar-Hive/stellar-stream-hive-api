/**
 * Turns a page's raw MDX source into plain Markdown for the "Copy page as
 * Markdown" button: drops `import`/`export` statements and JSX component tags
 * (keeping their children), and replaces components that only render a widget
 * with a short placeholder. Fenced code blocks are left untouched.
 */

/** Components that render an interactive widget with no Markdown equivalent. */
const WIDGET_PLACEHOLDERS: Record<string, string> = {
  DateToLedgerConverter: "_Interactive date-to-ledger converter (see the docs site)._",
  StreamingCalculator: "_Interactive streaming calculator (see the docs site)._",
};

/** Components whose props carry content worth keeping as a line of prose. */
const PROSE_COMPONENTS = new Set(["ApiEndpoint", "CalloutBox", "Details", "Figure"]);

/** Reads a quoted attribute value from a JSX opening tag. */
function attribute(tag: string, name: string): string | undefined {
  const match = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`).exec(tag);
  return match?.[1];
}

/** Renders a component's opening tag as a Markdown line, or "" to drop it. */
function openingTagToMarkdown(tag: string): string {
  const name = /^<([A-Za-z][\w.]*)/.exec(tag)?.[1] ?? "";
  if (WIDGET_PLACEHOLDERS[name]) return WIDGET_PLACEHOLDERS[name];
  if (!PROSE_COMPONENTS.has(name)) return "";

  const title = attribute(tag, "title") ?? attribute(tag, "summary");
  const description = attribute(tag, "description");
  const method = attribute(tag, "method");
  const path = attribute(tag, "path");

  if (name === "ApiEndpoint" && method && path) {
    return `**\`${method} ${path}\`**${description ? ` -- ${description}` : ""}`;
  }
  if (name === "Figure") {
    const caption = [title, description].filter(Boolean).join(" -- ");
    return caption ? `*Figure: ${caption}*` : "";
  }
  if (title) return `**${title}**`;
  return "";
}

/** Converts MDX source to plain Markdown. */
export function mdxToMarkdown(source: string): string {
  const lines = source.split("\n");
  const out: string[] = [];
  let inFence = false;
  let inJsx = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }

    // Multi-line JSX blocks: drop everything up to the closing tag.
    if (inJsx) {
      if (/^\s*<\/[A-Za-z][\w.]*>\s*$/.test(line)) inJsx = false;
      continue;
    }

    if (/^(import|export)\s/.test(line)) continue;

    const trimmed = line.trim();
    if (/^<[A-Za-z][\w.]*(\s[^>]*)?\/>$/.test(trimmed)) {
      const markdown = openingTagToMarkdown(trimmed);
      if (markdown) out.push(markdown);
      continue;
    }
    if (/^<[A-Za-z][\w.]*(\s[^>]*)?>$/.test(trimmed)) {
      const markdown = openingTagToMarkdown(trimmed);
      if (markdown) out.push(markdown);
      // Self-closing tags are handled above; a bare opening tag may still be
      // closed on the same line, in which case there is nothing to skip.
      inJsx = !/<\/[A-Za-z][\w.]*>\s*$/.test(trimmed);
      continue;
    }
    if (/^<\/[A-Za-z][\w.]*>\s*$/.test(trimmed)) continue;

    out.push(line);
  }

  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}
