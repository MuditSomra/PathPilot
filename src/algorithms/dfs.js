/**
 * algorithms/dfs.js
 *
 * Depth First Search. Explores using a stack; unlike BFS the path it
 * finds is not guaranteed to be the shortest one, which is expected DFS
 * behavior and is left as-is for educational contrast (SRS §1.1).
 *
 * Interface: run(grid, startNode, endNode) -> {
 *   visitedNodesInOrder, shortestPath, statistics,
 *   steps   // rich per-event trace consumed by Learning Mode
 * }
 */
import { getNeighbors } from "../core/GridManager.js";
import { createTraceRecorder, estimateMemoryBytes, toPlainNode } from "../core/algorithmTrace.js";
import { DFS_LINES } from "../constants/pseudocode.js";

function keyOf(row, col) {
  return `${row}:${col}`;
}

function reconstructPath(cameFrom, endKey) {
  const path = [];
  let currentKey = endKey;

  while (currentKey !== undefined && cameFrom.has(currentKey)) {
    const node = cameFrom.get(currentKey).node;
    path.unshift({ row: node.row, col: node.col });
    currentKey = cameFrom.get(currentKey).parentKey;
  }

  return path;
}

function getParentNode(cameFrom, key) {
  const entry = cameFrom.get(key);
  if (!entry || entry.parentKey === undefined) return null;
  return toPlainNode(cameFrom.get(entry.parentKey)?.node ?? null);
}

/** Snapshot of the stack, top to bottom, for the Learning Mode Stack view. */
function stackSnapshot(stackEntries) {
  return stackEntries
    .slice()
    .reverse()
    .map((entry) => ({ ...toPlainNode(entry.node), depth: entry.depth }));
}

export function run(grid, startNode, endNode) {
  const startTime = performance.now();

  const visitedNodesInOrder = [];
  const visitedKeys = new Set();
  const cameFrom = new Map();
  const trace = createTraceRecorder();
  const stack = [{ node: startNode, parentKey: undefined, depth: 0 }];

  const startKey = keyOf(startNode.row, startNode.col);
  const endKey = keyOf(endNode.row, endNode.col);

  const buildStats = (overrides = {}) => ({
    visitedCount: visitedNodesInOrder.length,
    queueSize: null,
    stackSize: stack.length,
    priorityQueueSize: null,
    currentDepth: overrides.currentDepth ?? 0,
    executionTimeMs: null,
    pathLength: overrides.pathLength ?? null,
    maxQueueSize: null,
    maxStackSize: trace.maxStackSize,
    memoryEstimateBytes: estimateMemoryBytes(stack.length, visitedKeys.size),
  });

  trace.trackStackSize(stack.length);
  trace.record({
    action: "init",
    stack: stackSnapshot(stack),
    explanation: `Starting DFS at (${startNode.row}, ${startNode.col}). Pushed onto the stack.`,
    pseudoCodeLine: DFS_LINES.PUSH_START,
    stats: buildStats(),
  });

  let pathFound = false;

  while (stack.length > 0) {
    const { node: current, parentKey, depth: currentDepth } = stack.pop();
    const currentKey = keyOf(current.row, current.col);
    trace.trackStackSize(stack.length);

    if (visitedKeys.has(currentKey)) {
      trace.record({
        action: "skip-visited",
        currentNode: { ...toPlainNode(current), depth: currentDepth },
        stack: stackSnapshot(stack),
        explanation: `(${current.row}, ${current.col}) was already visited via another branch — skipped.`,
        pseudoCodeLine: DFS_LINES.SKIP_IF_VISITED,
        stats: buildStats({ currentDepth }),
      });
      continue;
    }

    visitedKeys.add(currentKey);
    cameFrom.set(currentKey, { node: current, parentKey });

    if (currentKey !== startKey) {
      visitedNodesInOrder.push({ row: current.row, col: current.col });
    }

    const currentNodeMeta = {
      ...toPlainNode(current),
      depth: currentDepth,
      distance: currentDepth,
      parent: getParentNode(cameFrom, currentKey),
    };

    trace.record({
      action: "pop",
      currentNode: currentNodeMeta,
      stack: stackSnapshot(stack),
      explanation: `Popped node (${current.row}, ${current.col}) from the top of the stack.`,
      pseudoCodeLine: DFS_LINES.MARK_VISITED,
      stats: buildStats({ currentDepth }),
    });

    if (currentKey === endKey) {
      pathFound = true;
      trace.record({
        action: "goal-found",
        currentNode: currentNodeMeta,
        stack: stackSnapshot(stack),
        explanation: `Destination node (${current.row}, ${current.col}) reached.`,
        pseudoCodeLine: DFS_LINES.CHECK_GOAL,
        stats: buildStats({ currentDepth }),
      });
      break;
    }

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const neighborKey = keyOf(neighbor.row, neighbor.col);

      if (!visitedKeys.has(neighborKey)) {
        stack.push({ node: neighbor, parentKey: currentKey, depth: currentDepth + 1 });
        trace.trackStackSize(stack.length);

        trace.record({
          action: "push",
          currentNode: currentNodeMeta,
          neighbor: { ...toPlainNode(neighbor), depth: currentDepth + 1 },
          stack: stackSnapshot(stack),
          explanation: `Neighbour (${neighbor.row}, ${neighbor.col}) is unvisited — pushed onto the stack.`,
          pseudoCodeLine: DFS_LINES.PUSH_NEIGHBOR,
          stats: buildStats({ currentDepth }),
        });
      } else {
        trace.record({
          action: "skip-neighbor",
          currentNode: currentNodeMeta,
          neighbor: toPlainNode(neighbor),
          stack: stackSnapshot(stack),
          explanation: `Neighbour (${neighbor.row}, ${neighbor.col}) is already visited — skipped.`,
          pseudoCodeLine: DFS_LINES.CHECK_NEIGHBOR_VISITED,
          stats: buildStats({ currentDepth }),
        });
      }
    }
  }

  if (!pathFound) {
    trace.record({
      action: "no-path",
      stack: stackSnapshot(stack),
      explanation: "The stack is empty — no path exists between Start and End.",
      pseudoCodeLine: DFS_LINES.RETURN_NO_PATH,
      stats: buildStats(),
    });
  }

  const shortestPath = pathFound ? reconstructPath(cameFrom, endKey) : [];

  shortestPath.forEach((node, i) => {
    trace.record({
      action: "reveal-path",
      currentNode: toPlainNode(node),
      explanation: `Path step ${i + 1} of ${shortestPath.length}: (${node.row}, ${node.col}).`,
      pseudoCodeLine: DFS_LINES.CHECK_GOAL,
      stats: buildStats({ pathLength: i + 1 }),
    });
  });

  const executionTimeMs = performance.now() - startTime;

  trace.record({
    action: "complete",
    stack: [],
    explanation: pathFound
      ? `Done. Visited ${visitedNodesInOrder.length} nodes; the path DFS found is ${shortestPath.length} nodes long.`
      : `Done. No path found after visiting ${visitedNodesInOrder.length} nodes.`,
    pseudoCodeLine: DFS_LINES.RETURN_NO_PATH,
    stats: buildStats({ pathLength: shortestPath.length }),
  });

  trace.patchAllStats({ executionTimeMs });

  return {
    visitedNodesInOrder,
    shortestPath,
    statistics: {
      algorithm: "Depth First Search",
      visitedCount: visitedNodesInOrder.length,
      pathLength: shortestPath.length,
      executionTimeMs,
      pathFound,
    },
    steps: trace.steps,
  };
}

export default { run };
