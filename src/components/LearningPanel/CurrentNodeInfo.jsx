import React from "react";

function Field({ label, value }) {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-1 text-sm last:border-0 dark:border-slate-800">
      <span className="text-slate-400 dark:text-slate-500">{label}</span>
      <span className="font-mono text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}

/**
 * CurrentNodeInfo — details panel for whichever node the algorithm is
 * actively processing at the current step (SRS "Current Node": row,
 * column, distance, depth, parent, heuristic where applicable).
 */
export default function CurrentNodeInfo({ node }) {
  return (
    <section aria-labelledby="learning-node-heading" className="rounded-lg border border-slate-200 px-3 py-2.5 dark:border-slate-800">
      <h3 id="learning-node-heading" className="font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Current Node
      </h3>

      {!node ? (
        <p className="mt-1.5 text-sm text-slate-400 dark:text-slate-500">No node active yet.</p>
      ) : (
        <div className="mt-1">
          <Field label="Row" value={node.row} />
          <Field label="Column" value={node.col} />
          <Field label="Distance" value={node.distance} />
          <Field label="Depth" value={node.depth} />
          <Field label="Heuristic (h)" value={node.heuristic} />
          <Field label="f = g + h" value={node.fScore} />
          <Field label="Parent" value={node.parent ? `(${node.parent.row}, ${node.parent.col})` : "— (start node)"} />
        </div>
      )}
    </section>
  );
}
