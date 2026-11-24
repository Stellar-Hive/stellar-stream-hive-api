"use client";

import { usePathname } from "next/navigation";

const REPO_EDIT_BASE = "https://github.com/Stellar-Hive/stellar-stream-hive-api/edit/main/docs/app";

interface EditOnGitHubProps {
  /** Pre-formatted "Last updated" dates keyed by docs route (e.g. "/docs/streams"). */
  lastUpdated?: Record<string, string>;
}

/** Links to the GitHub editor for the current page's source file (`app/<route>/page.mdx`). */
export default function EditOnGitHub({ lastUpdated }: EditOnGitHubProps) {
  const pathname = usePathname();
  const route = pathname.replace(/\/+$/, "");
  const updated = lastUpdated?.[route];

  return (
    <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <a
        href={`${REPO_EDIT_BASE}${route}/page.mdx`}
        target="_blank"
        rel="noreferrer"
        className="text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
      >
        Edit this page on GitHub
      </a>
      {updated ? (
        <span className="text-slate-500 dark:text-slate-400">
          Last updated <time dateTime={updated}>{updated}</time>
        </span>
      ) : null}
    </p>
  );
}
