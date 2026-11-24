"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { nav } from "@/lib/nav";

/** "Section > Page" trail derived from the sidebar nav and the current pathname. */
export default function Breadcrumbs() {
  const pathname = usePathname();
  const group = nav.find((entry) => entry.items.some((item) => item.href === pathname));
  const page = group?.items.find((item) => item.href === pathname);

  if (!group || !page) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500 dark:text-slate-400">
      <ol className="flex flex-wrap items-center gap-2">
        <li>{group.title}</li>
        <li aria-hidden="true">/</li>
        <li>
          <span aria-current="page" className="font-medium text-slate-700 dark:text-slate-200">
            {page.title}
          </span>
        </li>
      </ol>
    </nav>
  );
}
