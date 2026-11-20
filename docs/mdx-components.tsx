import Link from "next/link";
import type { MDXComponents } from "mdx/types";

import CodeBlock from "@/components/CodeBlock";
import Figure from "@/components/Figure";
import StreamingCalculator from "@/components/StreamingCalculator";

/**
 * Global overrides applied to every MDX doc page. `CalloutBox` and `ApiEndpoint`
 * are intentionally *not* included here -- pages import them explicitly since
 * they take props (variant, method, path) that a blanket override can't supply.
 * `Figure` is exported here so diagrams have a consistent accessible wrapper
 * without an explicit import on every page. `StreamingCalculator` is exported
 * here so the streaming-math page can embed the interactive calculator without
 * an explicit import.
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
    StreamingCalculator,
    ...components,
  };
}