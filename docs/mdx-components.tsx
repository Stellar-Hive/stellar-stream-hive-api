import type { MDXComponents } from "mdx/types";

import CodeBlock from "@/components/CodeBlock";
import Figure from "@/components/Figure";

/**
 * Global overrides applied to every MDX doc page. `CalloutBox` and `ApiEndpoint`
 * are intentionally *not* included here -- pages import them explicitly since
 * they take props (variant, method, path) that a blanket override can't supply.
 * `Figure` is exported here so diagrams have a consistent accessible wrapper
 * without an explicit import on every page.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: (props) => <CodeBlock {...props} />,
    table: (props) => (
      <div className="my-6 overflow-x-auto">
        <table {...props} />
      </div>
    ),
    Figure,
    ...components,
  };
}
