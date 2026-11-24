"use client";

import { usePathname } from "next/navigation";

const REPO_EDIT_BASE = "https://github.com/Stellar-Hive/stellar-stream-hive-api/edit/main/docs/app";
const REPO_ISSUE_BASE = "https://github.com/Stellar-Hive/stellar-stream-hive-api/issues/new";

/** Links to the GitHub editor for the current page's source file (`app/<route>/page.mdx`). */
export default function EditOnGitHub() {
  const pathname = usePathname();
  const route = pathname.replace(/\/+$/, "");
  const sourcePath = `docs/app${route}/page.mdx`;
  const issueTitle = `[Docs]: ${route || "/"}`;
  const issueBody = `## Page affected\n\n\`${sourcePath}\`\n\n## What is wrong\n\n<!-- Describe the problem: typo, outdated statement, broken link, unclear wording, missing step, etc. -->\n\n## What is expected\n\n<!-- Describe what the page should say or show instead. -->\n\n## Source of truth\n\n<!-- Where can a maintainer verify the correct behavior? Avoid fabricated contract addresses, deployment details, or numeric claims. -->\n\n## Additional context\n\n<!-- Screenshots, related issues, or anything else that helps. -->\n`;
  const issueUrl = `${REPO_ISSUE_BASE}?template=docs_fix.md&title=${encodeURIComponent(
    issueTitle,
  )}&body=${encodeURIComponent(issueBody)}`;

  return (
    <p className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <a
        href={`${REPO_EDIT_BASE}${route}/page.mdx`}
        target="_blank"
        rel="noreferrer"
        className="text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
      >
        Edit this page on GitHub
      </a>
      <a
        href={issueUrl}
        target="_blank"
        rel="noreferrer"
        className="text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
      >
        Report a problem with this page
      </a>
    </p>
  );
}
