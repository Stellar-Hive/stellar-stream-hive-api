# Stellar Stream Hive — Docs Workspace

This is the documentation site for Stellar Stream Hive (contracts + API + web
app), built with Next.js (App Router) and MDX. It lives entirely under
`docs/` and is independent of the `api/` Rust workspace.

## Requirements

- Node.js 20+
- npm (the workspace uses `package-lock.json`)

## Setup

```bash
cd docs
npm install
```

## Scripts

All scripts are run from inside `docs/`.

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `npm run dev` | Starts the Next.js dev server with hot reload. |
| `build` | `npm run build` | Produces a production build (`.next/`). Also used in CI to validate every page compiles. |
| `start` | `npm run start` | Serves the production build locally after `npm run build`. |
| `lint` | `npm run lint` | Runs `next lint` (ESLint) across the workspace. |
| `check-links` | `npm run check-links` | Runs `scripts/check-links.mjs` to catch broken internal/external links in MDX content. |
| `check-nav` | `npm run check-nav` | Runs `scripts/check-nav.mjs` to verify every page is reachable from `lib/nav.ts` (no orphaned or dangling nav entries). |
| `check-metadata` | `npm run check-metadata` | Runs `scripts/check-metadata.mjs` to verify page frontmatter/metadata is present and well-formed. |
| `test:e2e` | `npx playwright test` | Playwright smoke tests (see `e2e/` and `playwright.config.ts`); CI runs this against every sidebar link. |

## Directory layout

```
docs/
  app/            Next.js App Router routes; MDX content pages live under app/docs/**
  components/     Shared MDX/React components used across pages (see below)
  e2e/            Playwright end-to-end specs
  lib/
    nav.ts        The single source of truth for sidebar navigation structure
  mdx-components.tsx   Maps MDX elements to the components in components/
  scripts/        Node scripts used by the check-* npm scripts and CI
  next.config.mjs, tailwind.config.ts, postcss.config.mjs, tsconfig.json
```

## Components

Reusable components available to MDX pages (via `mdx-components.tsx`):

- `ApiEndpoint` — documents a single API endpoint (method, path, params, example).
- `CalloutBox` — highlighted note/warning/tip box.
- `CodeBlock` — syntax-highlighted code sample with optional copy button.
- `DateToLedgerConverter` — interactive widget converting a date to an approximate Stellar ledger number.
- `Details` — collapsible disclosure section.
- `EditOnGitHub` — "edit this page" link back to the source file in this repo.
- `Figure` — image/diagram with caption.
- `PageNav` — previous/next page links at the bottom of a doc page.
- `Sidebar` — renders the nav tree from `lib/nav.ts`.
- `SiteHeader` — top navigation bar.
- `StreamingCalculator` — interactive widget for streaming-payment calculations.
- `TechArticleJsonLd` — emits `TechArticle` structured data (JSON-LD) for SEO.
- `ThemeToggle` — light/dark theme switcher.
- `Toc` — in-page table of contents generated from page headings (sidebar on wide
  screens, collapsible "On this page" disclosure above the article on narrow ones).

Use a component in an MDX page the same way you'd use any JSX component:

```mdx
<CalloutBox type="warning">
  This endpoint is rate-limited to 60 requests/minute.
</CalloutBox>
```

## Adding a page to the sidebar

1. Add the MDX file under `app/docs/<section>/<page>/page.mdx`.
2. Add a corresponding entry in `lib/nav.ts` pointing at that route, under the
   right section, so `check-nav` passes and the page is reachable from the
   sidebar.
3. Run `npm run check-nav`, `npm run check-metadata`, and `npm run check-links`
   locally before opening a PR.

New pages should generally start as an issue first — see
[CONTRIBUTING.md](../CONTRIBUTING.md) for why, and use the "Propose a new
page" issue template.

## Contributing

See the root [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution scope,
local development setup, and what kinds of docs changes are and aren't
welcome. PRs here should only touch files under `docs/` (or the root
`README.md` / `CONTRIBUTING.md` / `.github/` community files) — changes under
`api/` are out of scope for documentation contributions.
