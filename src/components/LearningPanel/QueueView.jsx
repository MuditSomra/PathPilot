import React from "react";

/**
 * QueueView — renders BFS's live queue, front to back. Keyed by
 * "row:col" so React animates entries sliding in/out via CSS
 * transitions as enqueue/dequeue events change the array (SRS: "Animate
 * enqueue and dequeue operations").
 */
export default function QueueView({ nodes }) {
  if (!nodes || nodes.length === 0) {
    return <p className="text-sm text-slate-400 dark:text-slate-500">Queue is empty.</p>;
  }

  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <span>Front</span>
        <span>Back</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {nodes.map((node, i) => (
          <div
            key={`${node.row}:${node.col}`}
            className="flex h-9 min-w-[3.25rem] animate-cell-path items-center justify-center rounded-md border border-teal-300 bg-teal-50 px-2 font-mono text-xs text-teal-700 dark:border-pilot-accent/40 dark:bg-pilot-accent/10 dark:text-pilot-accent"
            title={i === 0 ? "Front of queue — next to be dequeued" : undefined}
          >
            {node.row},{node.col}
          </div>
        ))}
      </div>
    </div>
  );
}
