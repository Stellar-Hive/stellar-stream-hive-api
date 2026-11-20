"use client";

import { useMemo, useState } from "react";

type FormState = {
  total: string;
  start: string;
  end: string;
  cliff: string;
  withdrawn: string;
  current: string;
};

const INITIAL: FormState = {
  total: "30000000000",
  start: "1000",
  end: "519400",
  cliff: "173800",
  withdrawn: "0",
  current: "173800",
};

// Worked cross-check against the page's own example:
// total 30_000_000_000 stroops, 518_400 ledgers, 10-day cliff at start + 172_800.
const EXAMPLE = {
  total: 30_000_000_000n,
  start: 1000n,
  end: 1000n + 518_400n,
  cliff: 1000n + 172_800n,
};

function computeStreamed(
  total: bigint,
  start: bigint,
  end: bigint,
  current: bigint,
): bigint {
  if (current < start) return 0n;
  if (current >= end) return total;
  // Multiply before divide, floor.
  return (total * (current - start)) / (end - start);
}

function computeWithdrawable(
  streamed: bigint,
  withdrawn: bigint,
  current: bigint,
  cliff: bigint,
): bigint {
  if (current < cliff) return 0n;
  const remaining = streamed - withdrawn;
  return remaining > 0n ? remaining : 0n;
}

function parseBigInt(value: string): bigint | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (!/^-?\d+$/.test(trimmed)) return null;
  try {
    return BigInt(trimmed);
  } catch {
    return null;
  }
}

type Parsed = {
  total: bigint;
  start: bigint;
  end: bigint;
  cliff: bigint;
  withdrawn: bigint;
  current: bigint;
};

type ValidationResult =
  | { ok: true; values: Parsed }
  | { ok: false; errors: string[] };

function validate(form: FormState): ValidationResult {
  const errors: string[] = [];

  const total = parseBigInt(form.total);
  const start = parseBigInt(form.start);
  const end = parseBigInt(form.end);
  const cliff = parseBigInt(form.cliff);
  const withdrawn = parseBigInt(form.withdrawn);
  const current = parseBigInt(form.current);

  if (total === null) errors.push("Total amount must be an integer.");
  if (start === null) errors.push("Start ledger must be an integer.");
  if (end === null) errors.push("End ledger must be an integer.");
  if (cliff === null) errors.push("Cliff ledger must be an integer.");
  if (withdrawn === null) errors.push("Withdrawn amount must be an integer.");
  if (current === null) errors.push("Current ledger must be an integer.");

  if (total !== null && total < 0n) errors.push("Total amount must be non-negative.");
  if (withdrawn !== null && withdrawn < 0n)
    errors.push("Withdrawn amount must be non-negative.");

  if (start !== null && end !== null && end <= start)
    errors.push("End ledger must be greater than start ledger.");
  if (start !== null && cliff !== null && cliff < start)
    errors.push("Cliff ledger must be greater than or equal to start ledger.");

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    values: {
      total: total as bigint,
      start: start as bigint,
      end: end as bigint,
      cliff: cliff as bigint,
      withdrawn: withdrawn as bigint,
      current: current as bigint,
    },
  };
}

const exampleStreamed = computeStreamed(
  EXAMPLE.total,
  EXAMPLE.start,
  EXAMPLE.end,
  EXAMPLE.cliff,
);
const exampleWithdrawable = computeWithdrawable(
  exampleStreamed,
  0n,
  EXAMPLE.cliff,
  EXAMPLE.cliff,
);
const exampleProgress =
  EXAMPLE.total > 0n ? Number((exampleStreamed * 100n) / EXAMPLE.total) : 0;

export default function StreamingCalculator() {
  const [form, setForm] = useState<FormState>(INITIAL);

  const result = useMemo(() => validate(form), [form]);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  let streamed: bigint | null = null;
  let withdrawable: bigint | null = null;
  let progress = 0;

  if (result.ok) {
    const { total, start, end, cliff, withdrawn, current } = result.values;
    streamed = computeStreamed(total, start, end, current);
    withdrawable = computeWithdrawable(streamed, withdrawn, current, cliff);
    progress = total > 0n ? Number((streamed * 100n) / total) : 0;
  }

  return (
    <div className="my-6 rounded-lg border border-fd-border p-4">
      <h3 className="mb-4 text-lg font-semibold">Streamed amount calculator</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Total amount (smallest units)</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.total}
            onChange={update("total")}
            className="rounded border border-fd-border bg-fd-background px-2 py-1 font-mono"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Start ledger</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.start}
            onChange={update("start")}
            className="rounded border border-fd-border bg-fd-background px-2 py-1 font-mono"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">End ledger</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.end}
            onChange={update("end")}
            className="rounded border border-fd-border bg-fd-background px-2 py-1 font-mono"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Cliff ledger</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.cliff}
            onChange={update("cliff")}
            className="rounded border border-fd-border bg-fd-background px-2 py-1 font-mono"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Withdrawn amount</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.withdrawn}
            onChange={update("withdrawn")}
            className="rounded border border-fd-border bg-fd-background px-2 py-1 font-mono"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Current ledger</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.current}
            onChange={update("current")}
            className="rounded border border-fd-border bg-fd-background px-2 py-1 font-mono"
          />
        </label>
      </div>

      {!result.ok && (
        <ul className="mt-4 list-disc pl-5 text-sm text-red-600">
          {result.errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      {result.ok && streamed !== null && withdrawable !== null && (
        <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <div className="rounded border border-fd-border p-2">
            <dt className="font-medium">Streamed</dt>
            <dd className="font-mono">{streamed.toString()}</dd>
          </div>
          <div className="rounded border border-fd-border p-2">
            <dt className="font-medium">Withdrawable</dt>
            <dd className="font-mono">{withdrawable.toString()}</dd>
          </div>
          <div className="rounded border border-fd-border p-2">
            <dt className="font-medium">Progress</dt>
            <dd className="font-mono">{progress}%</dd>
          </div>
        </dl>
      )}

      <p className="mt-4 text-xs text-fd-muted-foreground">
        Worked cross-check (page example): total {EXAMPLE.total.toString()} stroops,
        {" "}
        {(EXAMPLE.end - EXAMPLE.start).toString()} ledgers, cliff at start +{" "}
        {(EXAMPLE.cliff - EXAMPLE.start).toString()} ledgers. At the cliff, streamed ={" "}
        {exampleStreamed.toString()}, withdrawable = {exampleWithdrawable.toString()},
        progress = {exampleProgress}%.
      </p>
    </div>
  );
}