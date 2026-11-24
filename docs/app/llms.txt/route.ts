import { nav } from "@/lib/nav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-static";

export function GET(): Response {
  const lines: string[] = [
    "# Stellar Stream Hive",
    "",
    "> Documentation for the Stellar Stream Hive payment streaming contracts and indexer API.",
    "",
  ];

  for (const group of nav) {
    lines.push(`## ${group.title}`, "");
    for (const item of group.items) {
      lines.push(`- [${item.title}](${siteUrl}${item.href}): ${item.description}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
