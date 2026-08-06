import React from "react";
import { ALGORITHM_THEORY } from "../../constants/theory.js";

/**
 * AlgorithmOverview — the "at a glance" identity card for whichever
 * algorithm is selected. Purely presentational; re-renders automatically
 * when `algorithmId` changes because App passes it down as a prop.
 */
export default function AlgorithmOverview({ algorithmId }) {
  const theory = ALGORITHM_THEORY[algorithmId];
  if (!theory) return null;

  return (
    <section aria-labelledby="learning-overview-heading" className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="rounded bg-teal-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-teal-600 dark:bg-pilot-accent/10 dark:text-pilot-accent">
          {theory.shortLabel}
        </span>
        <h2 id="learning-overview-heading" className="font-display text-base font-semibold text-slate-800 dark:text-slate-100">
          {theory.name}
        </h2>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{theory.tagline}</p>
    </section>
  );
}
