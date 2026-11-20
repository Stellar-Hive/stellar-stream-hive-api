import type { ReactNode } from "react";

/**
 * A collapsible block for long optional reference material (full JSON
 * responses, edge cases). Built on the native <details>/<summary> elements, so
 * it works without JavaScript and keyboard users get Enter/Space toggling for free.
 *
 * Collapsed by default unless `open` is set. The summary shows a visible focus
 * ring; the chevron rotates when the block is open and is hidden from assistive tech.
 *
 * Usage in MDX (globally available, no import needed):
 *   <Details summary="Full response">
 *     ...markdown or code blocks...
 *   </Details>
 */
export default function Details({
  summary,
  open = false,
  children,
}: {
  summary: string;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      className="group my-6 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
      open={open}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-4 py-3 font-semibold text-slate-900 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-100 dark:hover:text-brand-300 dark:focus-visible:ring-brand-400 [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="inline-block transition-transform group-[[open]]:rotate-90">
          ▸
        </span>
        {summary}
      </summary>
      <div className="border-t border-slate-200 px-4 pb-4 pt-3 text-sm dark:border-slate-800">
        {children}
      </div>
    </details>
  );
}
