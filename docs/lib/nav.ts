export interface NavItem {
  title: string;
  href: string;
  /** Mirrors the page's `metadata.description`; used for structured data in the docs layout. */
  description: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/** Single source of truth for the docs sidebar, in reading order. */
export const nav: NavGroup[] = [
  {
    title: "Introduction",
    items: [
      {
        title: "Getting Started",
        href: "/docs/getting-started",
        description: "What payment streaming is, prerequisites, and how to create your first testnet stream.",
      },
    ],
  },
  {
    title: "Concepts",
    items: [
      {
        title: "Streaming Math",
        href: "/docs/concepts/streaming-math",
        description: "The exact linear accrual formula behind Stellar Stream Hive, derived step by step with a worked example.",
      },
      {
        title: "Security Model",
        href: "/docs/concepts/security-model",
        description: "Why the Vault contract is separate from the Stream contract, the caller-identity check that makes that separation meaningful, and the auth requirements for every function.",
      },
      {
        title: "Glossary",
        href: "/docs/concepts/glossary",
        description: "Short definitions of the Stellar and Soroban terms used across these docs: ledger, stroop, SAC, SEP-41, strkey and cliff.",
      },
    ],
  },
  {
    title: "Contracts",
    items: [
      {
        title: "Stream Contract",
        href: "/docs/contracts/stream",
        description: "Full function reference for the Stream contract: schedule, accrual, withdrawal, and cancellation.",
      },
      {
        title: "Vault Contract",
        href: "/docs/contracts/vault",
        description: "Full function reference for the Vault contract: the sole custodian of streamed funds.",
      },
      {
        title: "Registry Contract",
        href: "/docs/contracts/registry",
        description: "Full function reference for the Registry contract: on-chain indexing and aggregate stats.",
      },
    ],
  },
  {
    title: "API Reference",
    items: [
      {
        title: "Overview",
        href: "/docs/api/overview",
        description: "Base URL, response conventions, and error format for the Stellar Stream Hive indexer API.",
      },
      {
        title: "Streams",
        href: "/docs/api/streams",
        description: "GET /streams, GET /streams/:id, GET /senders/:address, and GET /recipients/:address.",
      },
      {
        title: "Stats",
        href: "/docs/api/stats",
        description: "GET /stats -- aggregate totals across every indexed stream.",
      },
    ],
  },
  {
    title: "Guides",
    items: [
      {
        title: "Web App",
        href: "/docs/web-app",
        description: "Connecting Freighter, creating a stream, watching a balance accrue, withdrawing, and cancelling from the Stellar Stream Hive web app.",
      },
      {
        title: "Integration",
        href: "/docs/integration",
        description: "Querying the indexer API from TypeScript, computing streamed_amount client-side, and interacting with the contracts directly.",
      },
    ],
  },
];
