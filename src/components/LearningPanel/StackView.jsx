import React from "react";

/**
 * StackView — renders DFS's live stack, top to bottom (SRS: "Animate
 * push and pop operations"). `nodes` is expected pre-ordered top-first
 * by the algorithm's step trace.
 */
export default function StackView({ nodes }) {
  if (!nodes || nodes.length === 0) {
    return <p className="text-sm text-slate-400 dark:text-slate-500">Stack is empty.</p>;
  }

  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">Top</div>
      <div className="flex flex-col gap-1.5">
        {nodes.map((node, i) => (
          <div
            key={`${node.row}:${node.col}`}
            className="flex h-9 animate-cell-path items-center justify-between rounded-md border border-amber-300 bg-amber-50 px-3 font-mono text-xs text-amber-700 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300"
            title={i === 0 ? "Top of stack — next to be popped" : undefined}
          >
            <span>
              {node.row},{node.col}
            </span>
            {typeof node.depth === "number" && <span className="text-[10px] opacity-70">depth {node.depth}</span>}
          </div>
        ))}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">Bottom</div>
    </div>
  );
}
