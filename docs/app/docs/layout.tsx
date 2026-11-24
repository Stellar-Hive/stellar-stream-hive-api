import type { Metadata } from "next";
import type { ReactNode } from "react";

import CopyAsMarkdown from "@/components/CopyAsMarkdown";
import EditOnGitHub from "@/components/EditOnGitHub";
import PageNav from "@/components/PageNav";
import Sidebar from "@/components/Sidebar";
import TechArticleJsonLd from "@/components/TechArticleJsonLd";
import Toc from "@/components/Toc";

/** Declares a canonical URL for each docs page, derived from its request path. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = ["/docs", ...(slug ?? [])].join("/");
  return { alternates: { canonical: path } };
}

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
      <TechArticleJsonLd />
      <Sidebar />
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-6 py-10 lg:px-12">
        <article className="prose prose-slate mx-auto max-w-3xl dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-brand-600 dark:prose-a:text-brand-400">
          {children}
          <CopyAsMarkdown />
          <EditOnGitHub />
          <PageNav />
        </article>
      </main>
      <Toc />
    </div>
  );
}
