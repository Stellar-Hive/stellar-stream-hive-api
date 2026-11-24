# Contributing to Stellar Stream Hive API

By participating in this project you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md).

> **Scope of this repository: contributors work in `docs/` only.**
>
> This repository hosts both the Rust indexer API (`api/`) and its
> documentation site (`docs/`). **`api/` is maintainer-only.** Pull requests
> that modify anything under `api/` will be closed without review, regardless
> of how small or well-intentioned the change is. This is a deliberate policy,
> not an oversight -- the API handles indexing logic for a payments platform,
> and changes to it go through a separate, more careful review process outside
> of general open-source contributions. If you've found a bug in the API or
> want to propose a change to it, please open an issue describing the problem
> instead of a PR with a fix.
>
> Everything below applies to `docs/` contributions.

## What we welcome in `docs/`

- Fixing typos, broken links, or outdated information.
- Clarifying explanations, especially in the [Streaming Math](docs/app/docs/concepts/streaming-math/page.mdx)
  and [Security Model](docs/app/docs/concepts/security-model/page.mdx) pages --
  these are the pages most likely to be read by someone auditing the platform,
  so precision matters more here than anywhere else in the docs.
- Adding examples (curl, TypeScript, Rust) that make an existing page more
  concrete, as long as they're accurate against the current contract/API
  behavior.
- Improving the docs site itself: components, styling, navigation, accessibility.

## What we don't want

- New pages that duplicate content covered elsewhere -- open an issue first if
  you think something is missing, so we can agree on where it belongs. Use the
  ["Propose a new docs page"](.github/ISSUE_TEMPLATE/docs_proposal.md) issue
  template for this.
- Speculative documentation for contract behavior that doesn't exist yet.
  Contract addresses and deployment details are placeholders until the
  contracts repo actually deploys (see
  [Getting Started](docs/app/docs/getting-started/page.mdx)) -- please don't
  submit PRs that replace those placeholders with guesses.
- Any change under `api/` (see above).

## Local development

```bash
cd docs
npm install
npm run dev
```

This starts the docs site at `http://localhost:3000` with hot reload. Edit any
`page.mdx` file under `docs/app/docs/` and the browser updates automatically.

Before opening a PR, confirm the site still builds cleanly:

```bash
npm run build
npm run check-links
npm run lint
```

## MDX conventions

- Every doc page is `app/docs/<section>/page.mdx` and exports a `metadata`
  object with `title` and `description`:

  ```mdx
  export const metadata = {
    title: "Your Page Title",
    description: "One sentence describing the page.",
  };
  ```

- Use the shared components instead of raw HTML/Tailwind where one exists:
  - `<CalloutBox variant="info" | "warning" | "success" | "danger">` for
    notes, warnings, tips, and security call-outs (`components/CalloutBox.tsx`).
  - `<ApiEndpoint method="GET" path="/streams/:id" description="..." />` at
    the top of an API reference section (`components/ApiEndpoint.tsx`).
  - `<Figure title="..." description="...">` wraps inline SVG diagrams with a
    visible caption and an accessible label (`components/Figure.tsx`). It is
    available globally — no import needed. `title` is required, and
    `description` is required too: it is the figure's alt text, shown after an
    em-dash, and `npm run check-figures` fails the build when it is missing or
    empty.
  - `<Details summary="...">` wraps long optional reference material (full
    JSON responses, edge cases) in a block that is collapsed by default. It is
    available globally and uses the native `<details>`/`<summary>` elements
    (`components/Details.tsx`). Add `open` to start it expanded.
  - Fenced code blocks (` ```typescript `, ` ```rust `, ` ```bash `, etc.) are
    automatically rendered through `components/CodeBlock.tsx` with a language
    label and copy button -- no need to wrap them in anything yourself.
    Add a `title="..."` meta string to show a filename or heading in the block
    header, next to the language label:

    ````mdx
    ```ts title="api/src/main.rs"
    // ...
    ```
    ````

    The title is optional; fences without one render exactly as before.
- Internal links use root-relative paths without a trailing slash, e.g.
  `[Streaming Math](/docs/concepts/streaming-math)`. Link to a specific
  heading with `#kebab-case-of-the-heading-text`, e.g.
  `/docs/concepts/streaming-math#why-multiply-before-divide`.
- Add new pages to the sidebar by editing `docs/lib/nav.ts` -- the sidebar has
  no other configuration; a page that exists but isn't in `nav.ts` is
  reachable by direct link but won't appear in navigation.
- Numeric/technical claims (formulas, worked examples, function signatures)
  should match the actual contract/API behavior described elsewhere in the
  docs or in `api/src/`. If you're not sure something is still accurate,
  flag it in your PR description rather than guessing.

## Available MDX components

These components are available globally to every `page.mdx` under
`docs/app/docs/` (no import needed) unless noted otherwise. Source lives in
`docs/components/`.

- **`CalloutBox`** (`CalloutBox.tsx`) -- a styled note/warning/tip box.
  `variant` is one of `"info" | "warning" | "success" | "danger"`.

  ```mdx
  <CalloutBox variant="warning">
    Withdrawals before the cliff ledger always return zero, even if funds
    have technically streamed.
  </CalloutBox>
  ```

- **`ApiEndpoint`** (`ApiEndpoint.tsx`) -- a labeled header for an API
  reference section. Place it at the top of the section it describes.

  ```mdx
  <ApiEndpoint
    method="GET"
    path="/streams/:id"
    description="Fetch the current state of a single stream by its on-chain ID."
  />
  ```

- **`Figure`** (`Figure.tsx`) -- wraps an inline SVG diagram with a visible
  caption and an accessible label. Both `title` and `description` are
  required; `description` becomes the figure's alt text (shown after an
  em-dash) and `npm run check-figures` fails the build if it's missing or
  empty.

  ```mdx
  <Figure title="Linear accrual over time" description="A straight line from zero at the start ledger to the total amount at the end ledger.">
    <svg viewBox="0 0 200 100">{/* diagram */}</svg>
  </Figure>
  ```

- **`Details`** (`Details.tsx`) -- a collapsed-by-default `<details>`/
  `<summary>` block for optional reference material (full JSON responses,
  edge cases). Add the `open` attribute to start it expanded.

  ```mdx
  <Details summary="Full JSON response">
    ```json
    { "id": "stream_123", "status": "active" }
    ```
  </Details>
  ```

- **Fenced code blocks** render through `CodeBlock.tsx` automatically -- just
  use normal Markdown fences with a language tag; you get a language label
  and a copy button for free.

  ```mdx
  \`\`\`typescript
  const client = new StreamHiveClient();
  \`\`\`
  ```

- **`StreamingCalculator`** (`StreamingCalculator.tsx`) -- an interactive,
  client-side calculator for the streamed/withdrawable amount formula. Takes
  no props; all state is internal. Drop it into a concepts page where the
  accrual formula is explained.

  ```mdx
  <StreamingCalculator />
  ```

- **`DateToLedgerConverter`** (`DateToLedgerConverter.tsx`) -- an interactive
  converter that estimates a ledger sequence from a target date, assuming a
  5-second ledger close time. Takes no props.

  ```mdx
  <DateToLedgerConverter />
  ```

- **`TechArticleJsonLd`** (`TechArticleJsonLd.tsx`) -- emits `TechArticle`
  JSON-LD structured data for the current page, derived from its entry in
  `docs/lib/nav.ts`. It's rendered once per page by the shared layout, not
  something you add to individual `.mdx` files.

Not every component in `docs/components/` is meant for page content --
`EditOnGitHub.tsx`, `PageNav.tsx`, `Sidebar.tsx`, `SiteHeader.tsx`,
`ThemeToggle.tsx`, and `Toc.tsx` are part of the site chrome (header,
sidebar, table of contents, theme switch) and are wired up by the layout,
not used inside `page.mdx` files.

## Documentation style guide

- **Tone**: direct and precise, written for someone integrating against or
  auditing the platform. Prefer short declarative sentences over marketing
  language. Say what a value *is* before explaining why it matters.
- **Heading structure**: one `#` (the page title, set via `metadata.title`,
  not repeated in the body), then `##` for major sections and `###` for
  subsections. Don't skip levels. Heading text should be stable, since other
  pages link to `#kebab-case-of-the-heading-text` anchors.
- **Code blocks**: always tag the language (` ```typescript `, ` ```rust `,
  ` ```bash `, ` ```json `) so `CodeBlock` can render the label correctly.
  Keep examples runnable/accurate -- copy-paste from a real request/response
  where possible rather than inventing shapes.
- **Terminology consistency**: use the same terms the rest of the docs use
  for the same concept -- e.g. "stream", "cliff ledger", "accrual", "vault",
  "registry" -- rather than introducing synonyms. When in doubt, check how
  [Streaming Math](docs/app/docs/concepts/streaming-math/page.mdx) and
  [Security Model](docs/app/docs/concepts/security-model/page.mdx) phrase
  the same idea, since those are the canonical references.
- **When to use `Details`**: collapse long, rarely-needed material (full
  JSON payloads, exhaustive edge-case lists) behind `<Details>` so the main
  explanation stays scannable. Don't hide anything a first-time reader needs
  to understand the core concept.
- **When to use `CalloutBox`**: reserve it for information that changes how
  a reader should act -- a security warning, a gotcha, a non-obvious
  constraint. Don't use it for routine asides; those belong in normal prose.
- **Numeric/technical claims**: must match the actual contract/API behavior
  (see the source-of-truth table below). If you can't verify a claim, flag
  it in the PR description instead of guessing.

## Where do I find the source of truth?

When editing a docs page, verify your claims against the relevant source files
before submitting. If you're not certain something is still accurate, flag it
in your PR description rather than guessing.

| Docs area | What to check |
|---|---|
| Contract behaviour (stream lifecycle, accrual formula, vault, registry) | `src/` in [`stellar-stream-hive-contract`](https://github.com/Stellar-Hive/stellar-stream-hive-contract); its own `docs/` for narrative explanations |
| API endpoints, response shapes, error codes | `api/src/` in this repo |
| UI flows, wallet integration, stream creation/management | [`stellar-stream-hive-frontend`](https://github.com/Stellar-Hive/stellar-stream-hive-frontend) |
| Streaming math / accrual formula | `docs/app/docs/concepts/streaming-math/page.mdx` (the canonical derivation lives here) |
| Security model | `docs/app/docs/concepts/security-model/page.mdx` |
| Deployed contract addresses | Not yet available — these are placeholders until the contracts repo deploys; do not replace them with guesses |

If you are unsure which source is authoritative for a particular claim, say so
in the PR description. A maintainer will point you to the right place.

## Pull request checklist

- [ ] Changes are entirely within `docs/` (or this `CONTRIBUTING.md`/root
      `README.md`, for meta changes).
- [ ] `npm run build` succeeds in `docs/`.
- [ ] `npm run check-links` succeeds in `docs/`.
- [ ] `npm run lint` succeeds in `docs/`.
- [ ] New pages are added to `docs/lib/nav.ts`.
- [ ] Internal links resolve (no typos in paths).
- [ ] No fabricated contract addresses, deployment details, or numeric claims.
