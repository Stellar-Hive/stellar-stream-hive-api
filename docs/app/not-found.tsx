import Link from "next/link";

import { nav, type NavItem } from "@/lib/nav";

/** Pages worth suggesting from a 404. Titles and links come from `lib/nav.ts`, so renames stay in sync. */
const SUGGESTED_HREFS = [
  "/docs/getting-started",
  "/docs/concepts/streaming-math",
  "/docs/api/overview",
  "/docs/concepts/glossary",
];

const allItems: NavItem[] = nav.flatMap((group) => group.items);
const suggested = SUGGESTED_HREFS.flatMap((href) => {
  const item = allItems.find((candidate) => candidate.href === href);
  return item ? [item] : [];
});

export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center"
    >
      <p className="text-6xl font-bold text-brand-600 dark:text-brand-400">404</p>
      <h1
        tabIndex={-1}
        className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 focus:outline-none dark:text-slate-50"
      >
        Page not found
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Back to home
        </Link>
        <Link
          href="/docs/getting-started"
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Getting Started
        </Link>
      </div>
      {suggested.length > 0 && (
        <section aria-labelledby="suggested-pages" className="mt-12 w-full text-left">
          <h2
            id="suggested-pages"
            className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            Or try one of these
          </h2>
          <ul className="mt-4 space-y-2">
            {suggested.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-brand-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-400 dark:hover:bg-slate-900 dark:focus-visible:ring-brand-400"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
