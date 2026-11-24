import type { MetadataRoute } from "next";

// Served at /manifest.webmanifest and linked automatically by Next.js in the
// built HTML (<link rel="manifest" href="/manifest.webmanifest">).
// Colours match the site's brand palette (tailwind.config.ts) and page
// background (app/layout.tsx): brand-600 on white.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stellar Stream Hive Docs",
    short_name: "Stream Hive",
    description:
      "Documentation for Stellar Stream Hive: real-time, on-chain payment streaming built on Stellar and Soroban.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f47db",
    icons: [
      {
        src: "/icon.svg",
        sizes: "32x32",
        type: "image/svg+xml",
      },
    ],
  };
}
