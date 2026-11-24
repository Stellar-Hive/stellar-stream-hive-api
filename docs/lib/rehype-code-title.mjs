/**
 * Rehype step: lifts a `title="..."` meta string off fenced code blocks onto the
 * `<pre>` element as `data-title`, so `components/CodeBlock.tsx` can render it in
 * the block header. Fences without a title are left untouched.
 */
const TITLE_PATTERN = /(?:^|\s)title=(?:"([^"]*)"|'([^']*)')/;

/**
 * Matches a bare `{2,4-6}` meta string (optionally quoted) and captures the
 * comma-separated line spec, e.g. `{2,4-6}` -> `2,4-6`.
 */
const HIGHLIGHT_PATTERN = /(?:^|\s)\{([\d,\s-]+)\}/;

export default function rehypeCodeTitle() {
  return (tree) => {
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if (node.type === "element" && node.tagName === "pre") {
        const code = (node.children ?? []).find(
          (child) => child.type === "element" && child.tagName === "code",
        );
        const meta = code?.data?.meta;
        if (typeof meta === "string") {
          const match = TITLE_PATTERN.exec(meta);
          const title = (match?.[1] ?? match?.[2] ?? "").trim();
          if (title) {
            node.properties = { ...node.properties, "data-title": title };
          }
          const highlight = HIGHLIGHT_PATTERN.exec(meta)?.[1]?.replace(/\s+/g, "");
          if (highlight) {
            node.properties = { ...node.properties, "data-highlight": highlight };
          }
        }
      }
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree);
  };
}
