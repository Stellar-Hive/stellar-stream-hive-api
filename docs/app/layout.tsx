import type { Metadata } from "next";
import type { ReactNode } from "react";

import BackToTop from "@/components/BackToTop";
import SiteHeader from "@/components/SiteHeader";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const title: Metadata["title"] = {
  default: "Stellar Stream Hive Docs",
  template: "%s | Stellar Stream Hive Docs",
};

const description =
  "Documentation for Stellar Stream Hive: real-time, on-chain payment streaming built on Stellar and Soroban.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    siteName: "Stellar Stream Hive Docs",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

// Runs before first paint: applies the saved theme, or the OS preference when none is saved.
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.classList.add("dark")}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-700 focus:shadow-lg dark:focus:bg-slate-900 dark:focus:text-brand-300"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
