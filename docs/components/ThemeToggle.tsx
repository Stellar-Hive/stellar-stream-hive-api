"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

type ThemeChoice = "light" | "dark" | "system";

const NEXT_CHOICE: Record<ThemeChoice, ThemeChoice> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const LABEL: Record<ThemeChoice, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

const ICON: Record<ThemeChoice, string> = {
  system: "🖥️",
  light: "☀️",
  dark: "🌙",
};

function readChoice(): ThemeChoice {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Storage can be blocked; fall back to following the OS.
  }
  return "system";
}

function applyChoice(choice: ThemeChoice) {
  const dark =
    choice === "dark" ||
    (choice === "system" && window.matchMedia(DARK_QUERY).matches);
  document.documentElement.classList.toggle("dark", dark);
}

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  useEffect(() => {
    setChoice(readChoice());
  }, []);

  // While following the OS, keep the page in sync with OS changes.
  useEffect(() => {
    if (choice !== "system") return;
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => applyChoice("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [choice]);

  function cycle() {
    const next = NEXT_CHOICE[choice];
    try {
      if (next === "system") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      // Storage can be blocked; the choice then lasts only for this page view.
    }
    applyChoice(next);
    setChoice(next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${LABEL[choice]} (click to switch to ${LABEL[NEXT_CHOICE[choice]]})`}
      title={LABEL[choice]}
      className="rounded-sm text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-400 dark:hover:text-slate-100 dark:focus-visible:ring-brand-400"
    >
      <span aria-hidden>{ICON[choice]}</span>
      <span className="sr-only">{LABEL[choice]}</span>
    </button>
  );
}
