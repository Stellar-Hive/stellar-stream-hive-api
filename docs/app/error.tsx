"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center"
    >
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-semibold tracking-tight text-slate-900 focus:outline-none dark:text-slate-50"
      >
        Something went wrong
      </h1>
      <p role="alert" className="mt-3 text-slate-600 dark:text-slate-400">
        An unexpected error occurred while loading this page. You can try again,
        or head back home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
