"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ThemeToggle from "@/components/ThemeToggle";

const FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400";

const REPOS = [
  { label: "API", href: "https://github.com/Stellar-Hive/stellar-stream-hive-api" },
  { label: "Contracts", href: "https://github.com/Stellar-Hive/stellar-stream-hive-contract" },
  { label: "Web App", href: "https://github.com/Stellar-Hive/stellar-stream-hive-frontend" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const onDocs = pathname.startsWith("/docs");

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
      <Link
        href="/"
        className={`flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 ${FOCUS}`}
      >
        <span aria-hidden className="text-xl">
          🌊
        </span>
        Stellar Stream Hive
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-3 text-sm sm:gap-5">
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
        <details className="relative sm:hidden">
          <summary
            className={`cursor-pointer list-none text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 [&::-webkit-details-marker]:hidden ${FOCUS}`}
          >
            Links
          </summary>
          <div className="absolute right-0 top-full mt-2 flex min-w-36 flex-col gap-1 rounded-md border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {REPOS.map((repo) => (
              <a
                key={repo.href}
                href={repo.href}
                target="_blank"
                rel="noreferrer"
                className={`rounded-sm px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 ${FOCUS}`}
              >
                {repo.label}
              </a>
            ))}
          </div>
        </details>
        <ThemeToggle />
      </nav>
    </header>
  );
}
