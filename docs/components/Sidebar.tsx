"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { nav } from "@/lib/nav";

const NAV_ID = "docs-sidebar-nav";

export default function Sidebar() {
  const pathname = usePathname();
  // Below `lg` the nav is collapsed behind a button; on desktop it is always shown.
  const [open, setOpen] = useState(false);

  // Collapse again after following a link so the article is visible.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="px-4 pt-4 lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={NAV_ID}
          onClick={() => setOpen((value) => !value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {open ? "Close menu" : "Menu"}
        </button>
      </div>
      <nav
        id={NAV_ID}
        aria-label="Documentation navigation"
        className={`w-full shrink-0 border-slate-200 px-4 py-8 dark:border-slate-800 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:w-64 lg:overflow-y-auto lg:border-r ${
          open ? "block" : "hidden"
        }`}
      >
      {nav.map((group) => (
        <div key={group.title} className="mb-6">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-500">
            {group.title}
          </p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-md px-2 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400 ${
                      active
                        ? "bg-brand-100 font-medium text-brand-800 dark:bg-brand-900/40 dark:text-brand-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      </nav>
    </>
  );
}
