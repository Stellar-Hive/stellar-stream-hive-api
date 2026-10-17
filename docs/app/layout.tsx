import type { Metadata } from "next";
import type { ReactNode } from "react";

import SiteHeader from "@/components/SiteHeader";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Stellar Stream Hive Docs",
    template: "%s | Stellar Stream Hive Docs",
  },
  description:
    "Documentation for Stellar Stream Hive: real-time, on-chain payment streaming built on Stellar and Soroban.",
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
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
