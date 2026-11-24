import type { ReactNode } from "react";

import EditOnGitHub from "@/components/EditOnGitHub";
import PageNav from "@/components/PageNav";
import Sidebar from "@/components/Sidebar";
import TechArticleJsonLd from "@/components/TechArticleJsonLd";
import Toc from "@/components/Toc";
import { formatLastUpdated, lastUpdatedForRoute } from "@/lib/last-updated";
import { nav } from "@/lib/nav";

// The "Last updated" date is read from git history at build time, so the docs
// layout is rendered per request rather than frozen into static HTML.
export const dynamic = "force-dynamic";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const lastUpdated: Record<string, string> = {};
  for (const item of nav.flatMap((group) => group.items)) {
    const date = lastUpdatedForRoute(item.href);
    if (date) lastUpdated[item.href] = formatLastUpdated(date);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
      <TechArticleJsonLd />
      <Sidebar />
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-6 py-10 lg:px-12">
        <article className="prose prose-slate mx-auto max-w-3xl dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-brand-600 dark:prose-a:text-brand-400">
          {children}
          <EditOnGitHub lastUpdated={lastUpdated} />
          <PageNav />
        </article>
      </main>
      <Toc />
    </div>
  );
}
