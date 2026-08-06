import React from "react";
import QueueView from "./QueueView.jsx";
import StackView from "./StackView.jsx";
import PriorityQueueView from "./PriorityQueueView.jsx";

const STRUCTURE_LABEL = {
  bfs: "Queue",
  dfs: "Stack",
  astar: "Priority Queue (Open Set)",
};

/**
 * LiveDataStructure — picks the right internal-data-structure view for
 * the selected algorithm. Adding a future algorithm that reuses an
 * existing structure (e.g. Dijkstra also uses a priority queue) needs
 * only a new entry in STRUCTURE_LABEL and the switch below — no new
 * section has to be built.
 */
export default function LiveDataStructure({ algorithmId, step }) {
  return (
    <section aria-labelledby="learning-structure-heading" className="rounded-lg border border-slate-200 px-3 py-2.5 dark:border-slate-800">
      <h3 id="learning-structure-heading" className="mb-2 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Live Data Structure — {STRUCTURE_LABEL[algorithmId] ?? "—"}
      </h3>

      {algorithmId === "bfs" && <QueueView nodes={step?.queue} />}
      {algorithmId === "dfs" && <StackView nodes={step?.stack} />}
      {algorithmId === "astar" && <PriorityQueueView entries={step?.priorityQueue} />}
    </section>
  );
}
