import Link from "next/link";

const HOW_IT_WORKS = [
  {
    title: "Create",
    body: "The sender locks the total amount in a stream with a start and end ledger, and an optional cliff.",
    href: "/docs/getting-started#quickstart-create-your-first-testnet-stream",
  },
  {
    title: "Accrue",
    body: "Funds vest linearly ledger by ledger between the start and end, so the recipient's claim grows continuously.",
    href: "/docs/concepts/streaming-math",
  },
  {
    title: "Withdraw or cancel",
    body: "The recipient withdraws what has streamed so far at any time. The sender can cancel, returning the unstreamed remainder.",
    href: "/docs/contracts/stream",
  },
];

const PILLARS = [
  {
    title: "Stream contract",
    body: "Holds each stream's schedule (start, cliff, end) and status, and computes streamed/withdrawable amounts with checked, multiply-before-divide arithmetic.",
    href: "/docs/contracts/stream",
  },
  {
    title: "Vault contract",
    body: "Holds the actual funds, isolated from the Stream contract's business logic. Only the Stream contract may call release or refund.",
    href: "/docs/contracts/vault",
  },
  {
    title: "Registry contract",
    body: "Maintains an on-chain index of all and active stream IDs and aggregate platform statistics (total streams, active streams, total streamed, and total withdrawn).",
    href: "/docs/contracts/registry",
  },
  {
    title: "Indexer API",
    body: "A Rust/Axum service that polls Soroban RPC, decodes Soroban events, and serves stream data over a simple REST API.",
    href: "/docs/api/overview",
  },
];

const REPOS = [
  { label: "stellar-stream-hive-api", href: "https://github.com/Stellar-Hive/stellar-stream-hive-api" },
  {
    label: "stellar-stream-hive-contract",
    href: "https://github.com/Stellar-Hive/stellar-stream-hive-contract",
  },
  {
    label: "stellar-stream-hive-frontend",
    href: "https://github.com/Stellar-Hive/stellar-stream-hive-frontend",
  },
];

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <section className="text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Built on Stellar + Soroban
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
          Real-time payment streaming for Stellar
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Stellar Stream Hive lets a sender lock funds once and have them accrue to a
          recipient continuously, ledger by ledger &mdash; payroll, vesting, subscriptions,
          and grants, all settled on-chain with no custodian in the middle.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/docs/getting-started"
            className="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Get started
          </Link>
          <Link
            href="/docs/concepts/streaming-math"
            className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400"
          >
            How the math works
          </Link>
        </div>
      </section>

      <section aria-labelledby="how-it-works" className="mt-20">
        <h2 id="how-it-works" className="text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          How it works
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => (
            <li key={step.title}>
              <Link
                href={step.href}
                className="flex h-full flex-col rounded-xl border border-slate-200 p-6 transition hover:border-brand-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                  Step {index + 1}
                </span>
                <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{step.body}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 grid gap-6 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
          <Link
            key={pillar.title}
            href={pillar.href}
            className="rounded-xl border border-slate-200 p-6 transition hover:border-brand-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400"
          >
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{pillar.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{pillar.body}</p>
          </Link>
        ))}
      </section>

      <section className="mt-20 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Repositories</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Stellar Stream Hive is split across three repositories. This site documents all
          three; the code for each lives here:
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {REPOS.map((repo) => (
            <li key={repo.href}>
              <a
                href={repo.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-brand-600 hover:underline dark:text-brand-400"
              >
                {repo.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
