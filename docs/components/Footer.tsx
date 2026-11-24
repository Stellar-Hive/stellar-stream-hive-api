const FOCUS =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400";

const LINK = `text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 ${FOCUS}`;

const API_REPO = "https://github.com/Stellar-Hive/stellar-stream-hive-api";

const REPOS = [
  { label: "API", href: API_REPO },
  { label: "Contracts", href: "https://github.com/Stellar-Hive/stellar-stream-hive-contract" },
  { label: "Web App", href: "https://github.com/Stellar-Hive/stellar-stream-hive-frontend" },
];

const PROJECT = [
  { label: "Contributing", href: `${API_REPO}/blob/main/CONTRIBUTING.md` },
  { label: "Apache-2.0 License", href: `${API_REPO}/blob/main/LICENSE` },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 px-6 py-8 text-sm dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-600 dark:text-slate-400">🌊 Stellar Stream Hive</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          {[...REPOS, ...PROJECT].map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={LINK}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
