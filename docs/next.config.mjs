import createMDX from "@next/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import remarkReadingTime from "./lib/remark-reading-time.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  reactStrictMode: true,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Renders GitHub-flavored Markdown tables, which mdx-components.tsx styles.
    // `remarkReadingTime` appends an "N min read" line under the page title,
    // computed from the MDX source at build time (code fences excluded).
    remarkPlugins: [remarkGfm, remarkReadingTime],
    // Gives every heading an id derived from its text (e.g. "## Why multiply
    // before divide" -> id="why-multiply-before-divide"), which is what every
    // in-page and cross-page `#anchor` link in these docs relies on.
    rehypePlugins: [
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
