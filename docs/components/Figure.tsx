import type { ReactNode } from "react";

/**
 * A semantic figure wrapper for inline SVG diagrams and other visual content.
 * Provides a visible caption and accessible name via aria-labelledby.
 *
 * Usage in MDX:
 *   import Figure from "@/components/Figure";
 *   <Figure title="Stream lifecycle" description="State transitions from Created to Exhausted.">
 *     <svg>…</svg>
 *   </Figure>
 */
export default function Figure({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const captionId = `fig-${title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
  return (
    <figure className="my-8" aria-labelledby={captionId}>
      {children}
      <figcaption id={captionId} className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold">{title}</span>
        {description && <span> — {description}</span>}
      </figcaption>
    </figure>
  );
}
