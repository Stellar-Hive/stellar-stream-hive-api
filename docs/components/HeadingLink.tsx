"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Copy-link affordance for doc headings. Rendered by `HeadingAnchor` next to
 * every h2/h3; clicking it copies the absolute URL of the section (including
 * the `#anchor`) and politely announces "Link copied" via a live region.
 */
export default function HeadingLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): fall back to a
      // temporary textarea so the affordance still works.
      const area = document.createElement("textarea");
      area.value = url;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link to this section"
        title="Copy link to this section"
        className="heading-copy ml-2 inline-flex cursor-pointer items-center rounded border-0 bg-transparent p-0 align-middle text-base font-normal text-slate-400 no-underline transition-opacity hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-500 dark:hover:text-brand-400 dark:focus-visible:ring-brand-400"
      >
        <span aria-hidden>🔗</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </>
  );
}
