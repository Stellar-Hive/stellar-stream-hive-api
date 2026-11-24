"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { nav } from "@/lib/nav";

/** Previous / Next links at the foot of a docs page, following the sidebar's reading order. */
export default function PageNav() {
  const pathname = usePathname();
  const pages = nav.flatMap((group) => group.items);
  const index = pages.findIndex((item) => item.href === pathname);

  if (index === -1) return null;

  const prev = index > 0 ? pages[index - 1] : undefined;
  const next = index < pages.length - 1 ? pages[index + 1] : undefined;

  return (
    <nav aria-label="Page navigation" className="mt-12 flex items-stretch justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800">
      {prev ? (
        <Link href={prev.href} className="group flex flex-col rounded-md px-3 py-2 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="text-xs text-slate-600 dark:text-slate-500">Previous</span>
          <span className="font-medium text-brand-600 dark:text-brand-400">&larr; {prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="group ml-auto flex flex-col rounded-md px-3 py-2 text-right transition hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="text-xs text-slate-600 dark:text-slate-500">Next</span>
          <span className="font-medium text-brand-600 dark:text-brand-400">{next.title} &rarr;</span>
        </Link>
      ) : null}
    </nav>
  );
}
