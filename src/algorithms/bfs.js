/**
 * algorithms/bfs.js
 *
 * Breadth First Search. Operates on a plain grid[row][col] array and
 * knows nothing about React, the DOM, or animation (ADR-004 / SRS §9).
 *
 * Interface: run(grid, startNode, endNode) -> {
 *   visitedNodesInOrder, shortestPath, statistics,
 *   steps   // rich per-event trace consumed by Learning Mode (see core/algorithmTrace.js)
 * }
 *
 * `steps` is purely additive — Visualizer Mode's AnimationManager only
 * ever reads visitedNodesInOrder/shortestPath/statistics, exactly as
 * before, so existing playback is unaffected.
 */
import Queue from "../utils/Queue.js";
import { getNeighbors } from "../core/GridManager.js";
import { createTraceRecorder, estimateMemoryBytes, toPlainNode, toPlainNodeArray } from "../core/algorithmTrace.js";
import { BFS_LINES } from "../constants/pseudocode.js";

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

export function run(grid, startNode, endNode) {
  const startTime = performance.now();

  const visitedNodesInOrder = [];
  const visitedKeys = new Set();
  const cameFrom = new Map();
  const depthMap = new Map();
  const queue = new Queue();
  const trace = createTraceRecorder();

  const startKey = keyOf(startNode.row, startNode.col);
  const endKey = keyOf(endNode.row, endNode.col);

  const buildStats = (overrides = {}) => ({
    visitedCount: visitedNodesInOrder.length,
    queueSize: queue.size,
    stackSize: null,
    priorityQueueSize: null,
    currentDepth: overrides.currentDepth ?? 0,
    executionTimeMs: null, // back-filled with the real total once the run finishes
    pathLength: overrides.pathLength ?? null,
    maxQueueSize: trace.maxQueueSize,
    maxStackSize: null,
    memoryEstimateBytes: estimateMemoryBytes(queue.size, visitedKeys.size),
  });

  queue.enqueue(startNode);
  visitedKeys.add(startKey);
  cameFrom.set(startKey, { node: startNode, parentKey: undefined });
  depthMap.set(startKey, 0);
  trace.trackQueueSize(queue.size);

  trace.record({
    action: "init",
    queue: toPlainNodeArray(queue.toArray()),
    explanation: `Starting BFS at (${startNode.row}, ${startNode.col}). Added to the queue and marked visited.`,
    pseudoCodeLine: BFS_LINES.ENQUEUE_START,
    stats: buildStats(),
  });

  let pathFound = false;

  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    const currentKey = keyOf(current.row, current.col);
    const currentDepth = depthMap.get(currentKey) ?? 0;
    trace.trackQueueSize(queue.size);

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
      action: "dequeue",
      currentNode: currentNodeMeta,
      queue: toPlainNodeArray(queue.toArray()),
      explanation: `Dequeued node (${current.row}, ${current.col}) from the front of the queue.`,
      pseudoCodeLine: BFS_LINES.DEQUEUE,
      stats: buildStats({ currentDepth }),
    });

    if (currentKey === endKey) {
      pathFound = true;
      trace.record({
        action: "goal-found",
        currentNode: currentNodeMeta,
        queue: toPlainNodeArray(queue.toArray()),
        explanation: `Destination node (${current.row}, ${current.col}) reached.`,
        pseudoCodeLine: BFS_LINES.CHECK_GOAL,
        stats: buildStats({ currentDepth }),
      });
      break;
    }

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const neighborKey = keyOf(neighbor.row, neighbor.col);

      if (!visitedKeys.has(neighborKey)) {
        visitedKeys.add(neighborKey);
        cameFrom.set(neighborKey, { node: neighbor, parentKey: currentKey });
        depthMap.set(neighborKey, currentDepth + 1);
        queue.enqueue(neighbor);
        trace.trackQueueSize(queue.size);

        trace.record({
          action: "enqueue",
          currentNode: currentNodeMeta,
          neighbor: { ...toPlainNode(neighbor), depth: currentDepth + 1 },
          queue: toPlainNodeArray(queue.toArray()),
          explanation: `Neighbour (${neighbor.row}, ${neighbor.col}) is unvisited — added to the queue.`,
          pseudoCodeLine: BFS_LINES.ENQUEUE_NEIGHBOR,
          stats: buildStats({ currentDepth }),
        });
      } else {
        trace.record({
          action: "skip-neighbor",
          currentNode: currentNodeMeta,
          neighbor: toPlainNode(neighbor),
          queue: toPlainNodeArray(queue.toArray()),
          explanation: `Neighbour (${neighbor.row}, ${neighbor.col}) is already visited — skipped.`,
          pseudoCodeLine: BFS_LINES.CHECK_NEIGHBOR_VISITED,
          stats: buildStats({ currentDepth }),
        });
      }
    }
  }

  if (!pathFound) {
    trace.record({
      action: "no-path",
      queue: toPlainNodeArray(queue.toArray()),
      explanation: "The queue is empty — no path exists between Start and End.",
      pseudoCodeLine: BFS_LINES.RETURN_NO_PATH,
      stats: buildStats(),
    });
  }

  const shortestPath = pathFound ? reconstructPath(cameFrom, endKey) : [];

  shortestPath.forEach((node, i) => {
    trace.record({
      action: "reveal-path",
      currentNode: toPlainNode(node),
      explanation: `Path step ${i + 1} of ${shortestPath.length}: (${node.row}, ${node.col}).`,
      pseudoCodeLine: BFS_LINES.CHECK_GOAL,
      stats: buildStats({ pathLength: i + 1 }),
    });
  });

  const executionTimeMs = performance.now() - startTime;

  trace.record({
    action: "complete",
    queue: [],
    explanation: pathFound
      ? `Done. Visited ${visitedNodesInOrder.length} nodes; shortest path is ${shortestPath.length} nodes long.`
      : `Done. No path found after visiting ${visitedNodesInOrder.length} nodes.`,
    pseudoCodeLine: BFS_LINES.RETURN_NO_PATH,
    stats: buildStats({ pathLength: shortestPath.length }),
  });

  trace.patchAllStats({ executionTimeMs });

  return {
    visitedNodesInOrder,
    shortestPath,
    statistics: {
      algorithm: "Breadth First Search",
      visitedCount: visitedNodesInOrder.length,
      pathLength: shortestPath.length,
      executionTimeMs,
      pathFound,
    },
    steps: trace.steps,
  };
}

export default { run };
