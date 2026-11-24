"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

// Heading text without the permalink "#" that rehype-autolink-headings adds.
function headingText(heading: HTMLHeadingElement) {
  const clone = heading.cloneNode(true) as HTMLElement;
  clone.querySelector(".heading-anchor")?.remove();
  return clone.textContent ?? "";
}

/**
 * Extracts the article's rendered h2/h3 headings and tracks the section in view.
 * Shared by the desktop sidebar and the small-screen disclosure.
 */
function useTocItems() {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("article h2[id], article h3[id]"),
    );
    setItems(
      headings.map((heading) => ({
        id: heading.id,
        text: headingText(heading),
        level: heading.tagName === "H2" ? 2 : 3,
      })),
    );
    setActiveId(null);

    if (headings.length === 0) return;

    // A heading counts as "current" once it reaches the top band of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [pathname]);

  return { items, activeId };
}

function TocLinks({
  items,
  activeId,
  onNavigate,
}: {
  items: TocItem[];
  activeId: string | null;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-1 border-l border-slate-200 text-sm dark:border-slate-800">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active ? "location" : undefined}
              onClick={onNavigate}
              className={`-ml-px block border-l py-1 transition ${
                item.level === 3 ? "pl-6" : "pl-3"
              } ${
                active
                  ? "border-brand-600 font-medium text-brand-700 dark:border-brand-400 dark:text-brand-300"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Collapsible "On this page" disclosure for narrow screens, shown above the
 * article. Uses a native <details> element so it is keyboard and
 * screen-reader accessible without extra scripting.
 */
export function TocDisclosure() {
  const { items, activeId } = useTocItems();
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="mb-8 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900 xl:hidden"
    >
      <summary className="cursor-pointer select-none font-semibold text-slate-700 marker:text-slate-400 dark:text-slate-200">
        On this page
      </summary>
      <nav aria-label="On this page" className="mt-3">
        <TocLinks
          items={items}
          activeId={activeId}
          onNavigate={() => setOpen(false)}
        />
      </nav>
    </details>
  );
}

/**
 * "On this page" links built from the article's rendered h2/h3 headings.
 * Shown only at `xl` and up; the active entry follows the section in view.
 */
export default function Toc() {
  const { items, activeId } = useTocItems();

  if (items.length === 0) return null;

  return (
    <aside
      aria-label="On this page"
      className="hidden w-56 shrink-0 py-10 pr-6 xl:sticky xl:top-16 xl:block xl:h-[calc(100vh-4rem)] xl:overflow-y-auto"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        On this page
      </p>
      <TocLinks items={items} activeId={activeId} />
    </aside>
  );
}
