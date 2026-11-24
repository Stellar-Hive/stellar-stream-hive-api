import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

import type { MetadataRoute } from "next";

import { nav } from "@/lib/nav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const docsRoot = path.resolve(process.cwd());

/**
 * Last commit date for a file, read from git at build time.
 *
 * Returns `undefined` when git is unavailable (e.g. a source tarball build) or
 * the file has no history, so the sitemap simply omits `lastModified` instead
 * of inventing a date. The commit timestamp is used as-is (not `new Date()`),
 * which keeps the output deterministic across CI runs.
 */
function gitLastModified(file: string): Date | undefined {
  const absolute = path.join(docsRoot, file);
  if (!existsSync(absolute)) return undefined;

  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
      cwd: docsRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    if (!out) return undefined;
    const date = new Date(out);
    return Number.isNaN(date.getTime()) ? undefined : date;
  } catch {
    return undefined;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const homeLastModified = gitLastModified("app/page.tsx");

  const pages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      ...(homeLastModified ? { lastModified: homeLastModified } : {}),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const group of nav) {
    for (const item of group.items) {
      // Nav hrefs are root-relative ("/docs/..."); the page lives at
      // app/docs/.../page.mdx.
      const pageFile = `app${item.href}/page.mdx`;
      const lastModified = gitLastModified(pageFile);

      pages.push({
        url: `${siteUrl}${item.href}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return pages;
}
