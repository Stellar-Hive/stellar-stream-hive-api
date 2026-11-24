import type { ReactNode } from "react";

import HeadingLink from "@/components/HeadingLink";

/**
 * Wraps an h2/h3 rendered from MDX so it can host the copy-link button.
 * `rehype-slug` gives the heading its `id`; without one there is nothing to
 * link to, so the heading renders unchanged.
 */
export default function HeadingAnchor({
  as: Tag,
  id,
  children,
  ...props
}: {
  as: "h2" | "h3";
  id?: string;
  children?: ReactNode;
} & Record<string, unknown>) {
  if (!id) {
    return (
      <Tag {...props}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag id={id} className="group/heading" {...props}>
      {children}
      <HeadingLink id={id} />
    </Tag>
  );
}
