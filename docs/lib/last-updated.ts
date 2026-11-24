import { execFileSync } from "node:child_process";
import path from "node:path";

const DOCS_ROOT = process.cwd();
const cache = new Map<string, string | null>();

/**
 * Returns the ISO 8601 commit date of the last git commit that touched the
 * docs page source for `route` (e.g. "/docs/streams" ->
 * "app/docs/streams/page.mdx"), or null when git history is unavailable
 * (shallow clone, no .git, untracked file). Runs at build time only.
 */
export function lastUpdatedForRoute(route: string): string | null {
  const clean = route.replace(/\/+$/, "");
  const relative = path.posix.join("app", clean, "page.mdx");
  const cached = cache.get(relative);
  if (cached !== undefined) return cached;

  let date: string | null = null;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", relative], {
      cwd: DOCS_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    date = out || null;
  } catch {
    date = null;
  }

  cache.set(relative, date);
  return date;
}

/** Formats an ISO 8601 date as a stable, locale-independent "Month D, YYYY" string. */
export function formatLastUpdated(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
