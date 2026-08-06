import React from "react";

/**
 * PriorityQueueView — renders A*'s live open set, sorted by f-score
 * (SRS: "Every entry should show Node, g, h, f. Display entries sorted
 * by priority."). Entries arrive pre-sorted from the algorithm's step
 * trace (algorithms/astar.js openSetSnapshot).
 */
export default function PriorityQueueView({ entries }) {
  if (!entries || entries.length === 0) {
    return <p className="text-sm text-slate-400 dark:text-slate-500">Open set is empty.</p>;
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="bg-slate-50 font-mono uppercase tracking-wider text-slate-400 dark:bg-slate-900 dark:text-slate-500">
            <th className="px-2 py-1.5">Node</th>
            <th className="px-2 py-1.5">g</th>
            <th className="px-2 py-1.5">h</th>
            <th className="px-2 py-1.5">f</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr
              key={`${entry.row}:${entry.col}`}
              className={`animate-cell-path border-t border-slate-100 font-mono dark:border-slate-800 ${
                i === 0 ? "bg-teal-50 text-teal-700 dark:bg-pilot-accent/10 dark:text-pilot-accent" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              <td className="px-2 py-1.5">
                {entry.row},{entry.col}
              </td>
              <td className="px-2 py-1.5">{entry.g}</td>
              <td className="px-2 py-1.5">{entry.h}</td>
              <td className="px-2 py-1.5 font-semibold">{entry.f}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
