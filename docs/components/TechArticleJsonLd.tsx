"use client";

import { usePathname } from "next/navigation";

import { nav } from "@/lib/nav";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/**
 * Emits schema.org `TechArticle` JSON-LD for the current docs page. Headline and description come
 * from `lib/nav.ts`, which mirrors each page's `metadata` export. Rendered during static prerender,
 * so crawlers that do not run JavaScript still receive it.
 */
export default function TechArticleJsonLd() {
  const pathname = usePathname();
  const route = pathname.replace(/\/+$/, "");
  const item = nav.flatMap((group) => group.items).find((candidate) => candidate.href === route);

  if (!item) return null;

  const url = `${siteUrl}${route}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: item.title,
    description: item.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "Stellar Stream Hive Docs", url: siteUrl },
  };

  // Escape "<" so no string in the data can close the script tag early.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
