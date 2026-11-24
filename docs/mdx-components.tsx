import Link from "next/link";
import type { MDXComponents } from "mdx/types";

import CodeBlock from "@/components/CodeBlock";
import Details from "@/components/Details";
import Figure from "@/components/Figure";
import HeadingAnchor from "@/components/HeadingAnchor";
import StreamingCalculator from "@/components/StreamingCalculator";

/**
 * Global overrides applied to every MDX doc page. `CalloutBox` and `ApiEndpoint`
 * are intentionally *not* included here -- pages import them explicitly since
 * they take props (variant, method, path) that a blanket override can't supply.
 * `Figure` is exported here so diagrams have a consistent accessible wrapper
 * without an explicit import on every page. `Details` is exported here too, for
 * collapsible reference blocks.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: (props) => <CodeBlock {...props} />,
    a: ({ href = "", children, ...props }) => {
      if (href.startsWith("/") || href.startsWith("#")) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noreferrer" {...props}>
          {children}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    },
    table: (props) => (
      <div className="my-6 max-h-[70vh] overflow-auto">
        <table {...props} />
      </div>
    ),
    Figure,
    Details,
    StreamingCalculator,
    // h2/h3 get a copy-link button that copies the absolute section URL.
    h2: (props) => <HeadingAnchor as="h2" {...props} />,
    h3: (props) => <HeadingAnchor as="h3" {...props} />,
    ...components,
  };
}