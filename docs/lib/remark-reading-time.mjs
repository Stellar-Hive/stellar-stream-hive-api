// Remark plugin: inserts an estimated reading time ("N min read", 200 wpm) as a
// paragraph directly under the page's first (title) heading.
//
// The estimate is computed from the MDX source at build time. Code fences and
// inline code are excluded, as are MDX import/export statements and JSX tags,
// since none of those are prose the reader reads linearly. The inserted
// paragraph is marked `aria-hidden` so it stays out of the accessible heading
// structure and out of the document outline.

const WORDS_PER_MINUTE = 200;

// Node types whose text content is not prose.
const SKIPPED_NODE_TYPES = new Set([
  "code",
  "inlineCode",
  "mdxjsEsm",
  "mdxFlowExpression",
  "mdxTextExpression",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
]);

function countWords(node) {
  if (SKIPPED_NODE_TYPES.has(node.type)) return 0;
  if (typeof node.value === "string") {
    const matches = node.value.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu);
    return matches ? matches.length : 0;
  }
  if (!Array.isArray(node.children)) return 0;
  return node.children.reduce((total, child) => total + countWords(child), 0);
}

function readingTimeLabel(wordCount) {
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

export default function remarkReadingTime() {
  return (tree) => {
    const label = readingTimeLabel(countWords(tree));
    const index = tree.children.findIndex(
      (node) => node.type === "heading" && node.depth === 1,
    );
    if (index === -1) return;

    tree.children.splice(index + 1, 0, {
      type: "paragraph",
      data: {
        hName: "p",
        hProperties: {
          className: ["reading-time"],
          "aria-hidden": "true",
        },
      },
      children: [{ type: "text", value: label }],
    });
  };
}
