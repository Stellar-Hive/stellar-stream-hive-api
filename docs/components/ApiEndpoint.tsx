type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Each method gets its own light/dark colour pair. Text colours are chosen to
// keep at least 4.5:1 contrast against their badge background in both themes.
const METHOD_STYLES: Record<Method, string> = {
  GET: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100",
  POST: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
  PUT: "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
  PATCH: "bg-violet-100 text-violet-900 dark:bg-violet-900 dark:text-violet-100",
  DELETE: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
};

/** A method + path banner used at the top of each API reference section. */
export default function ApiEndpoint({
  method,
  path,
  description,
}: {
  method: Method;
  path: string;
  description?: string;
}) {
  return (
    <div className="my-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded px-2 py-1 text-xs font-bold tracking-wide ${METHOD_STYLES[method]}`}
        >
          {method}
        </span>
        <code className="font-mono text-sm text-slate-900 dark:text-slate-100">{path}</code>
      </div>
      {description ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      ) : null}
    </div>
  );
}
