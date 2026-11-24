import type { ReactNode } from "react";

type Variant = "info" | "warning" | "success" | "danger";

const STYLES: Record<Variant, { wrapper: string; icon: ReactNode; label: string }> = {
  info: {
    wrapper:
      "border-blue-400 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 shrink-0"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9 9a.75.75 0 0 0 0 1.5h.25v2.25H9a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5h-.25V9.75A.75.75 0 0 0 10 9H9Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    label: "Note",
  },
  warning: {
    wrapper:
      "border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 shrink-0"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495a1.75 1.75 0 0 1 3.03 0l6.28 10.875A1.75 1.75 0 0 1 16.28 16H3.72a1.75 1.75 0 0 1-1.515-2.63l6.28-10.875ZM10 6.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 10 6.5Zm0 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    label: "Warning",
  },
  success: {
    wrapper:
      "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 shrink-0"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    label: "Tip",
  },
  danger: {
    wrapper:
      "border-red-400 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 shrink-0"
      >
        <path
          fillRule="evenodd"
          d="M10 1.944A11.954 11.954 0 0 1 2.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0 1 10 1.944ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    label: "Security",
  },
};

/** A titled, colored callout used throughout the docs for notes, warnings, and security call-outs. */
export default function CalloutBox({
  variant = "info",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const style = STYLES[variant];
  return (
    <div className={`my-6 rounded-lg border-l-4 px-4 py-3 ${style.wrapper}`} role="note">
      <p className="mb-1 flex items-center gap-2 font-semibold">
        {style.icon}
        <span className="sr-only">{style.label}: </span>
        {title ?? style.label}
      </p>
      <div className="text-sm leading-relaxed [&>p]:m-0 [&>p+p]:mt-2">{children}</div>
    </div>
  );
}
