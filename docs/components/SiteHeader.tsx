"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";

const FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400";

const REPOS = [
  { label: "API", href: "https://github.com/Stellar-Hive/stellar-stream-hive-api" },
  { label: "Contracts", href: "https://github.com/Stellar-Hive/stellar-stream-hive-contract" },
  { label: "Web App", href: "https://github.com/Stellar-Hive/stellar-stream-hive-frontend" },
];

interface SearchEntry {
  title: string;
  href: string;
  section: string;
  description: string;
}

const MAX_RESULTS = 8;

// Dependency-free matcher: every whitespace-separated term must appear in the
// entry's title, section or description. Title hits rank above the rest.
function search(entries: SearchEntry[], query: string): SearchEntry[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    const haystack = `${title} ${entry.section} ${entry.description}`.toLowerCase();
    if (!terms.every((term) => haystack.includes(term))) continue;
    const score = terms.reduce((total, term) => total + (title.includes(term) ? 2 : 1), 0);
    scored.push({ entry, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, MAX_RESULTS)
    .map((item) => item.entry);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const onDocs = pathname.startsWith("/docs");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => search(entries, query), [entries, query]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/search-index.json")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: SearchEntry[]) => {
        if (!cancelled) setEntries(data);
      })
      .catch(() => {
        // Search is optional; a missing index just yields no results.
      });
    inputRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelled = true;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <Link
        href="/"
        className={`flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 ${FOCUS}`}
      >
        <span aria-hidden className="text-xl">
          🌊
        </span>
        Stellar Stream Hive
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-5 text-sm">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className={`text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 ${FOCUS}`}
        >
          <span aria-hidden>🔍</span>
          <span className="sr-only">Search docs</span>
        </button>
        <Link
          href="/docs/getting-started"
          aria-current={onDocs ? "page" : undefined}
          className={`text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 ${FOCUS}`}
        >
          Docs
        </Link>
        {REPOS.map((repo) => (
          <a
            key={repo.href}
            href={repo.href}
            target="_blank"
            rel="noreferrer"
            className={`hidden text-slate-600 hover:text-slate-900 sm:inline dark:text-slate-400 dark:hover:text-slate-100 ${FOCUS}`}
          >
            {repo.label}
          </a>
        ))}
        <ThemeToggle />
      </nav>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search docs"
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 p-4 pt-24"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the docs"
              aria-label="Search the docs"
              className={`w-full border-b border-slate-200 bg-transparent pb-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:text-slate-100 ${FOCUS}`}
            />
            <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto text-sm">
              {results.map((result) => (
                <li key={result.href}>
                  <Link
                    href={result.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-sm px-2 py-1.5 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 ${FOCUS}`}
                  >
                    <span className="font-medium">{result.title}</span>
                    {result.section ? (
                      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                        {result.section}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
              {query.trim() && results.length === 0 ? (
                <li className="px-2 py-1.5 text-slate-500 dark:text-slate-400">No results.</li>
              ) : null}
            </ul>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`mt-3 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 ${FOCUS}`}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

