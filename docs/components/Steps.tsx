import { Children, isValidElement, type ReactNode } from "react";

/**
 * A numbered procedure. Each child becomes one step with a visible counter, so
 * the order survives copy/paste and screen readers announce "Step N".
 *
 * Spacing around code blocks is normalised here: the global `pre` override
 * renders a `CodeBlock` with its own margins, which would otherwise collapse
 * against the step body and make multi-step procedures look uneven.
 *
 * Usage in MDX (globally available, no import needed):
 *   <Steps>
 *     <div>**Create identities** -- generate and fund two keys.</div>
 *     <div>**Create a stream** -- invoke `create_stream`.</div>
 *   </Steps>
 *
 * Plain markdown list items also work:
 *   <Steps>
 *     - First step
 *     - Second step
 *   </Steps>
 */
export default function Steps({ children }: { children: ReactNode }) {
  const steps = Children.toArray(children).filter(isValidElement);
  return (
    <ol className="my-6 list-none space-y-6 pl-0 [counter-reset:step]">
      {steps.map((step, index) => (
        <li
          key={step.key ?? index}
          className="relative pl-11 [counter-increment:step] [&>pre]:my-3 [&>pre:first-child]:mt-0 [&>pre:last-child]:mb-0 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
        >
          <span
            aria-hidden
            className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white before:content-[counter(step)] dark:bg-brand-500"
          />
          <span className="sr-only">Step {index + 1}: </span>
          {step}
        </li>
      ))}
    </ol>
  );
}
