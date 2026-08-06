/**
 * core/algorithmTrace.js
 *
 * Shared instrumentation used by every algorithm module to build the
 * "Learning Mode" step trace. This lives in core/ (business logic), not
 * in algorithms/, because it's cross-cutting infrastructure rather than
 * pathfinding logic itself — but it still knows nothing about React.
 *
 * Design (per project brief): algorithms push fully-formed step objects
 * as they run. The UI only ever renders this metadata; it never infers
 * algorithm behavior from grid state. This is what lets Learning Mode's
 * timeline scrub/replay be a pure "render steps[i]" operation.
 */

/** Rough per-node memory estimate for the "Memory Usage" stat (bytes). */
const ESTIMATED_BYTES_PER_NODE = 64;

export function estimateMemoryBytes(openSetSize, closedSetSize) {
  return (openSetSize + closedSetSize) * ESTIMATED_BYTES_PER_NODE;
}

/**
 * Creates a recorder that accumulates step objects plus running
 * high-water marks (max queue/stack size) that individual steps need
 * for their stats snapshot.
 */
export function createTraceRecorder() {
  const steps = [];
  let maxQueueSize = 0;
  let maxStackSize = 0;
  let maxOpenSetSize = 0;

  return {
    steps,
    get maxQueueSize() {
      return maxQueueSize;
    },
    get maxStackSize() {
      return maxStackSize;
    },
    get maxOpenSetSize() {
      return maxOpenSetSize;
    },
    trackQueueSize(size) {
      maxQueueSize = Math.max(maxQueueSize, size);
      return maxQueueSize;
    },
    trackStackSize(size) {
      maxStackSize = Math.max(maxStackSize, size);
      return maxStackSize;
    },
    trackOpenSetSize(size) {
      maxOpenSetSize = Math.max(maxOpenSetSize, size);
      return maxOpenSetSize;
    },
    /** Records one step. `index`/`animationStep` are assigned automatically. */
    record(step) {
      const index = steps.length;
      steps.push({
        index,
        currentNode: null,
        neighbor: null,
        queue: null,
        stack: null,
        priorityQueue: null,
        ...step,
        stats: { ...step.stats, animationStep: index },
      });
      return index;
    },
    /** Back-fills a field (e.g. final executionTimeMs) across every recorded step. */
    patchAllStats(patch) {
      steps.forEach((step) => {
        Object.assign(step.stats, typeof patch === "function" ? patch(step) : patch);
      });
    },
  };
}

/** Small helper: plain {row, col} projection, used when snapshotting node lists. */
export function toPlainNode(node) {
  if (!node) return null;
  return { row: node.row, col: node.col };
}

export function toPlainNodeArray(nodes) {
  return nodes.map(toPlainNode);
}
