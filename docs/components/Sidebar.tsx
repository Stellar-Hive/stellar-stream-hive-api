"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { nav } from "@/lib/nav";

const NAV_ID = "docs-sidebar-nav";
const COLLAPSED_GROUPS_KEY = "docs-sidebar-collapsed-groups";

function groupId(title: string): string {
  return `docs-sidebar-group-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function readCollapsedGroups(): string[] {
  try {
    const raw = window.localStorage.getItem(COLLAPSED_GROUPS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

function writeCollapsedGroups(titles: string[]): void {
  try {
    window.localStorage.setItem(COLLAPSED_GROUPS_KEY, JSON.stringify(titles));
  } catch {
    // Storage may be unavailable (private mode, quota); collapsing still works.
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  // Below `lg` the nav is collapsed behind a button; on desktop it is always shown.
  const [open, setOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Restore persisted group state after mount to keep server and client markup equal.
  useEffect(() => {
    setCollapsedGroups(readCollapsedGroups());
  }, []);

  const toggleGroup = (title: string) => {
    setCollapsedGroups((current) => {
      const next = current.includes(title)
        ? current.filter((value) => value !== title)
        : [...current, title];
      writeCollapsedGroups(next);
      return next;
    });
  };

  // Collapse again after following a link so the article is visible.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Keep the active link visible in the scrollable sidebar on load and route change.
  useEffect(() => {
    const active = navRef.current?.querySelector<HTMLElement>(
      '[aria-current="page"]',
    );
    if (!active) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    active.scrollIntoView({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [pathname]);

  // Close on Escape and return focus to the toggle button.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div className="px-4 pt-4 lg:hidden">
        <button
          ref={toggleRef}
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
        ref={navRef}
        id={NAV_ID}
        aria-label="Documentation navigation"
        className={`w-full shrink-0 border-slate-200 px-4 py-8 dark:border-slate-800 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:w-64 lg:overflow-y-auto lg:border-r ${
          open ? "block" : "hidden"
        }`}
      >
      {nav.map((group) => {
        const containsActive = group.items.some(
          (item) => pathname === item.href,
        );
        const expanded =
          containsActive || !collapsedGroups.includes(group.title);
        const panelId = groupId(group.title);
        return (
          <div key={group.title} className="mb-6">
            <h2 className="mb-2">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggleGroup(group.title)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:focus-visible:ring-brand-400"
              >
                <span>{group.title}</span>
                <span aria-hidden="true" className="text-[0.65rem]">
                  {expanded ? "▾" : "▸"}
                </span>
              </button>
            </h2>
            <ul id={panelId} hidden={!expanded} className="space-y-1">
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
        );
      })}
      </nav>
    </>
  );
}
