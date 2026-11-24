"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "testnet-banner-dismissed";

/** Slim, dismissible "testnet / unaudited" banner shown above every docs article. */
export default function TestnetBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Storage can be blocked; the banner then shows on every page view.
      setDismissed(false);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage can be blocked; the dismissal then lasts only for this page view.
    }
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div
      role="note"
      className="mb-6 flex items-start gap-3 rounded-lg border-l-4 border-red-400 bg-red-50 px-4 py-2 text-sm text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
    >
      <p className="m-0 flex-1 leading-relaxed">
        <span aria-hidden>🚨</span>{" "}
        <strong>Unaudited -- testnet only.</strong> These contracts have not been
        externally audited. Read the{" "}
        <Link href="/docs/concepts/security-model" className="underline">
          Security Model
        </Link>{" "}
        before using them.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="rounded-sm px-1 font-semibold hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <span aria-hidden>✕</span>
        <span className="sr-only">Dismiss testnet banner</span>
      </button>
    </div>
  );
}
