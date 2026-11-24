"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

/** Fetches the current page's plain-Markdown copy (written at build time) and copies it. */
export default function CopyAsMarkdown() {
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const route = pathname.replace(/^\/docs\/?/, "").replace(/\/+$/, "");

  async function copy() {
    try {
      const response = await fetch(`/markdown/${route}.md`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await navigator.clipboard.writeText(await response.text());
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <p className="mt-8 text-sm">
      <button
        type="button"
        onClick={copy}
        className="text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
      >
        {status === "copied" ? "Copied!" : "Copy page as Markdown"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" ? "Page Markdown copied to the clipboard." : ""}
        {status === "error" ? "Could not copy the page Markdown." : ""}
      </span>
    </p>
  );
}
