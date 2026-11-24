import type { ReactNode } from "react";

import EditOnGitHub from "@/components/EditOnGitHub";
import PageNav from "@/components/PageNav";
import Sidebar from "@/components/Sidebar";
import TechArticleJsonLd from "@/components/TechArticleJsonLd";
import Toc, { TocDisclosure } from "@/components/Toc";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
      <TechArticleJsonLd />
      <Sidebar />
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-6 py-10 lg:px-12">
        <article className="prose prose-slate mx-auto max-w-3xl dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-brand-600 dark:prose-a:text-brand-400">
          <TocDisclosure />
          {children}
          <EditOnGitHub />
          <PageNav />
        </article>
      </main>
      <Toc />
    </div>
  );
}
