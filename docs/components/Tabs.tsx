"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

const STORAGE_PREFIX = "stream-hive-tabs:";

/** Reads the persisted tab label for a group, tolerating blocked storage. */
function readStored(group: string): string | null {
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + group);
  } catch {
    return null;
  }
}

/** Persists the selected tab label for a group, tolerating blocked storage. */
function writeStored(group: string, label: string): void {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + group, label);
  } catch {
    // Storage can be unavailable (private mode, quota, disabled cookies).
  }
}

/**
 * A single tab panel. Only rendered by `Tabs`, which supplies the ARIA wiring
 * through `Tabs`'s own props; the label is the tab's visible name.
 *
 * Usage in MDX (globally available, no import needed):
 *   <Tabs group="integration-paging">
 *     <Tab label="TypeScript">...</Tab>
 *     <Tab label="Python">...</Tab>
 *   </Tabs>
 */
export function Tab({ children }: { label: string; children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Accessible tab list for multi-language examples. Implements the WAI-ARIA
 * tabs pattern: roving tabindex, arrow/Home/End keyboard navigation, and
 * `aria-controls`/`aria-labelledby` wiring between tabs and panels.
 *
 * The selected tab is remembered per `group` in localStorage (wrapped in
 * try/catch so blocked storage never breaks the page). Without a `group`, the
 * selection is not persisted.
 */
export default function Tabs({
  group,
  children,
}: {
  group?: string;
  children: ReactNode;
}) {
  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement<{ label: string; children: ReactNode }> =>
      isValidElement(child) && typeof (child.props as { label?: unknown }).label === "string",
  );
  const labels = tabs.map((tab) => tab.props.label);

  const baseId = useId();
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Restore the persisted tab after mount so server and client markup match.
  useEffect(() => {
    if (!group) return;
    const stored = readStored(group);
    const index = stored === null ? -1 : labels.indexOf(stored);
    if (index >= 0) setSelected(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  const select = useCallback(
    (index: number) => {
      setSelected(index);
      if (group) writeStored(group, labels[index]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [group, labels.join("\u0000")],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = selected === last ? 0 : selected + 1;
    else if (event.key === "ArrowLeft") next = selected === 0 ? last : selected - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  if (tabs.length === 0) return null;

  return (
    <div className="my-6 rounded-lg border border-fd-border">
      <div
        role="tablist"
        aria-label={group ? `Examples: ${group}` : "Examples"}
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1 border-b border-fd-border px-2 pt-2"
      >
        {tabs.map((tab, index) => {
          const isSelected = index === selected;
          return (
            <button
              key={tab.props.label}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => select(index)}
              className={`rounded-t border-b-2 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400 ${
                isSelected
                  ? "border-brand-500 text-brand-700 dark:text-brand-300"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {tab.props.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.props.label}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== selected}
          tabIndex={0}
          className="px-4 pb-4 pt-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400"
        >
          {tab.props.children}
        </div>
      ))}
    </div>
  );
}
