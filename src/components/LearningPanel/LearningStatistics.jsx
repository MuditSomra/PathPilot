import React from "react";

function Stat({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-800 dark:bg-slate-900/60">
      <p className="font-mono text-[9.5px] uppercase leading-tight tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return "—";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * LearningStatistics — the live version of the Statistics component,
 * driven off the current step's stats snapshot instead of the final
 * post-run result (SRS "Statistics": visited nodes, queue/stack/PQ
 * size, current depth, animation step, execution time, path length,
 * high-water marks, memory estimate).
 */
export default function LearningStatistics({ step, stepCount }) {
  const stats = step?.stats;

  return (
    <section aria-labelledby="learning-stats-heading" className="rounded-lg border border-slate-200 px-3 py-2.5 dark:border-slate-800">
      <h3 id="learning-stats-heading" className="mb-2 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Statistics
      </h3>

      {!stats ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">Run a visualization to see live statistics.</p>
      ) : (
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          <Stat label="Visited Nodes" value={stats.visitedCount} />
          <Stat label="Step" value={`${(stats.animationStep ?? 0) + 1} / ${stepCount}`} />
          <Stat label="Current Depth" value={stats.currentDepth ?? "—"} />
          {stats.queueSize !== null && stats.queueSize !== undefined && <Stat label="Queue Size" value={stats.queueSize} />}
          {stats.stackSize !== null && stats.stackSize !== undefined && <Stat label="Stack Size" value={stats.stackSize} />}
          {stats.priorityQueueSize !== null && stats.priorityQueueSize !== undefined && (
            <Stat label="Open Set Size" value={stats.priorityQueueSize} />
          )}
          {stats.maxQueueSize !== null && stats.maxQueueSize !== undefined && <Stat label="Max Queue Size" value={stats.maxQueueSize} />}
          {stats.maxStackSize !== null && stats.maxStackSize !== undefined && <Stat label="Max Stack Size" value={stats.maxStackSize} />}
          {stats.maxOpenSetSize !== null && stats.maxOpenSetSize !== undefined && (
            <Stat label="Max Open Set" value={stats.maxOpenSetSize} />
          )}
          <Stat label="Path Length" value={stats.pathLength ?? "—"} />
          <Stat label="Execution Time" value={stats.executionTimeMs !== null ? `${stats.executionTimeMs.toFixed(2)} ms` : "—"} />
          <Stat label="Est. Memory" value={formatBytes(stats.memoryEstimateBytes)} />
        </div>
      )}
    </section>
  );
}
