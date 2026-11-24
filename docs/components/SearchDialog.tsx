"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { nav } from "@/lib/nav";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400";

interface Result {
  title: string;
  href: string;
  description: string;
  group: string;
}

const RESULTS: Result[] = nav.flatMap((group) =>
  group.items.map((item) => ({
    title: item.title,
    href: item.href,
    description: item.description,
    group: group.title,
  })),
);

function matches(result: Result, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    result.title.toLowerCase().includes(q) ||
    result.description.toLowerCase().includes(q) ||
    result.group.toLowerCase().includes(q)
  );
}

/** Docs search dialog: `/` or Ctrl/Cmd+K to open, arrows to move, Enter to follow, Esc to close. */
export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const results = useMemo(() => RESULTS.filter((r) => matches(r, query)), [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    triggerRef.current?.focus();
  }, []);

  const openDialog = useCallback(() => {
    setOpen(true);
    setActive(0);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (open) return;
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        openDialog();
      } else if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openDialog();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, openDialog]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[active] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function onDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      const result = results[active];
      if (result) {
        event.preventDefault();
        close();
        window.location.assign(result.href);
      }
    } else if (event.key === "Tab") {
      // Keep focus inside the dialog while it is modal.
      const focusables = event.currentTarget.querySelectorAll<HTMLElement>(
        'input, a[href], button:not([disabled])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-100 ${FOCUS}`}
      >
        <span aria-hidden>🔍</span>
        <span className="hidden sm:inline">Search</span>
        <kbd aria-hidden className="hidden rounded border border-slate-300 px-1 text-xs sm:inline dark:border-slate-700">
          /
        </kbd>
        <span className="sr-only">Search the docs</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/50 p-4 pt-24"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            onKeyDown={onDialogKeyDown}
            className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 id={titleId} className="sr-only">
              Search the docs
            </h2>
            <p id={descriptionId} className="sr-only">
              Type to filter documentation pages. Use the up and down arrow keys to move through
              results, Enter to open the highlighted page, and Escape to close.
            </p>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              placeholder="Search the docs…"
              aria-label="Search the docs"
              aria-controls="docs-search-results"
              aria-activedescendant={
                results[active] ? `docs-search-result-${active}` : undefined
              }
              className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${FOCUS}`}
            />
            <p aria-live="polite" role="status" className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              {results.length === 1 ? "1 result" : `${results.length} results`}
            </p>
            <ul
              id="docs-search-results"
              ref={listRef}
              role="listbox"
              aria-label="Search results"
              className="mt-2 max-h-80 overflow-y-auto"
            >
              {results.map((result, index) => (
                <li
                  key={result.href}
                  id={`docs-search-result-${index}`}
                  role="option"
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  className={`rounded-md px-3 py-2 text-sm ${
                    index === active
                      ? "bg-brand-50 text-brand-900 dark:bg-slate-800 dark:text-slate-100"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Link
                    href={result.href}
                    onClick={close}
                    tabIndex={-1}
                    className={`block ${FOCUS}`}
                  >
                    <span className="font-medium">{result.title}</span>
                    <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                      {result.group}
                    </span>
                    <span className="mt-1 block text-xs text-slate-600 dark:text-slate-400">
                      {result.description}
                    </span>
                  </Link>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
                  No pages match “{query}”.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
