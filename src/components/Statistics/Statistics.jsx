import React from "react";

function StatCard({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-0.5 font-display text-lg font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

/**
 * Statistics — purely presentational readout of the last run (FR-7).
 * Receives a fully-formed statistics object; performs no calculation.
 */
export default function Statistics({ statistics }) {
  if (!statistics) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
        Run a visualization to see statistics.
      </div>
    );
  }

  const { algorithm, visitedCount, pathLength, executionTimeMs, pathFound } = statistics;

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
      <StatCard label="Algorithm" value={algorithm} />
      <StatCard label="Visited Nodes" value={visitedCount} />
      <StatCard label="Path Length" value={pathFound ? pathLength : "—"} />
      <StatCard label="Time" value={`${executionTimeMs.toFixed(2)} ms`} />
      <StatCard label="Status" value={pathFound ? "Path Found" : "No Path"} />
    </div>
  );
}
