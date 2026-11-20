'use client';

import { useMemo, useState } from 'react';

const SECONDS_PER_LEDGER = 5;
const MS_PER_LEDGER = SECONDS_PER_LEDGER * 1000;

function toDateTimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export default function DateToLedgerConverter() {
  const [targetDate, setTargetDate] = useState<string>('');
  const [currentLedger, setCurrentLedger] = useState<string>('');

  const result = useMemo(() => {
    if (!targetDate || !currentLedger) {
      return null;
    }

    const parsedLedger = Number(currentLedger);
    if (!Number.isFinite(parsedLedger) || parsedLedger < 0 || !Number.isInteger(parsedLedger)) {
      return { error: 'Enter a valid current ledger sequence (a whole number).' } as const;
    }

    const targetMs = new Date(targetDate).getTime();
    if (!Number.isFinite(targetMs)) {
      return { error: 'Enter a valid target date.' } as const;
    }

    const nowMs = Date.now();
    const deltaMs = targetMs - nowMs;
    const deltaLedgers = Math.floor(deltaMs / MS_PER_LEDGER);
    const estimatedLedger = parsedLedger + deltaLedgers;

    return {
      estimatedLedger,
      deltaLedgers,
      isPast: deltaMs < 0,
    } as const;
  }, [targetDate, currentLedger]);

  return (
    <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-lg font-semibold">Date-to-ledger converter</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Estimate which ledger will be open at a given date, using the documented assumption
        that ledgers close roughly every {SECONDS_PER_LEDGER} seconds. All calculations run
        locally in your browser — nothing is fetched from the chain.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="dtl-target-date"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Target date
          </label>
          <input
            id="dtl-target-date"
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div>
          <label
            htmlFor="dtl-current-ledger"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Current ledger sequence
          </label>
          <input
            id="dtl-current-ledger"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            placeholder="e.g. 50000000"
            value={currentLedger}
            onChange={(e) => setCurrentLedger(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Look up the latest ledger on{' '}
            <a
              href="https://stellar.expert/explorer/public"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Stellar Expert
            </a>{' '}
            or query the{' '}
            <a
              href="https://developers.stellar.org/docs/data/apis/horizon/api-reference/get-ledgers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Horizon <code>/ledgers</code> endpoint
            </a>
            .
          </p>
        </div>
      </div>

      <div className="mt-4">
        {result === null && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter a target date and your current ledger to see an estimate.
          </p>
        )}

        {'error' in result && (
          <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
        )}

        {'estimatedLedger' in result && (
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Estimated ledger at target date
            </p>
            <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">
              ≈ {result.estimatedLedger.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {result.isPast ? 'About' : 'About'}{' '}
              {Math.abs(result.deltaLedgers).toLocaleString()} ledgers{' '}
              {result.isPast ? 'before' : 'after'} the current ledger.
            </p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This is an <strong>estimate</strong> only. Ledger close times vary in practice,
              so the actual ledger at that date may differ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}