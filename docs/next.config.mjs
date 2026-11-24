import createMDX from "@next/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import rehypeCodeTitle from "./lib/rehype-code-title.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  reactStrictMode: true,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Renders GitHub-flavored Markdown tables, which mdx-components.tsx styles.
    remarkPlugins: [remarkGfm],
    // Gives every heading an id derived from its text (e.g. "## Why multiply
    // before divide" -> id="why-multiply-before-divide"), which is what every
    // in-page and cross-page `#anchor` link in these docs relies on.
    rehypePlugins: [
      // Lifts a `title="..."` fence meta string onto the `<pre>` as `data-title`
      // so CodeBlock can show it in the header next to the language label.
      rehypeCodeTitle,
      rehypeSlug,
      // Appends a "#" permalink to every heading. It is a real link, so it is
      // reachable by keyboard; globals.css reveals it on hover or focus.
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
            ariaLabel: "Permalink to this section",
          },
          content: { type: "text", value: "#" },
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
