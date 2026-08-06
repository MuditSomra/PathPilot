/**
 * algorithms/astar.js
 *
 * A* search using the Manhattan distance heuristic (admissible for a
 * 4-directional uniform-cost grid) and a binary-heap priority queue.
 *
 * Interface: run(grid, startNode, endNode) -> {
 *   visitedNodesInOrder, shortestPath, statistics,
 *   steps   // rich per-event trace consumed by Learning Mode, including
 *           // live g/h/f scores for every open-set entry
 * }
 */
import PriorityQueue from "../utils/PriorityQueue.js";
import { getNeighbors } from "../core/GridManager.js";
import { createTraceRecorder, estimateMemoryBytes, toPlainNode } from "../core/algorithmTrace.js";
import { ASTAR_LINES } from "../constants/pseudocode.js";

function keyOf(row, col) {
  return `${row}:${col}`;
}

function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
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

/** Priority-queue snapshot sorted by f-score, each entry annotated with g/h/f (Learning Mode PQ view). */
function openSetSnapshot(openEntries) {
  return Array.from(openEntries.values())
    .sort((a, b) => a.f - b.f)
    .map((entry) => ({
      row: entry.node.row,
      col: entry.node.col,
      g: entry.g,
      h: entry.h,
      f: entry.f,
    }));
}

export function run(grid, startNode, endNode) {
  const startTime = performance.now();

  const startKey = keyOf(startNode.row, startNode.col);
  const endKey = keyOf(endNode.row, endNode.col);

  const gScore = new Map([[startKey, 0]]);
  const cameFrom = new Map([[startKey, { node: startNode, parentKey: undefined }]]);
  const visitedKeys = new Set();
  const visitedNodesInOrder = [];
  const trace = createTraceRecorder();

  const openSet = new PriorityQueue();
  const openEntries = new Map(); // key -> { node, g, h, f } — current best known open entry

  const startH = manhattanDistance(startNode, endNode);
  openSet.push(startNode, startH);
  openEntries.set(startKey, { node: startNode, g: 0, h: startH, f: startH });

  const buildStats = (overrides = {}) => ({
    visitedCount: visitedNodesInOrder.length,
    queueSize: null,
    stackSize: null,
    priorityQueueSize: openEntries.size,
    currentDepth: overrides.currentDepth ?? 0,
    executionTimeMs: null,
    pathLength: overrides.pathLength ?? null,
    maxQueueSize: null,
    maxStackSize: null,
    maxOpenSetSize: trace.maxOpenSetSize,
    memoryEstimateBytes: estimateMemoryBytes(openEntries.size, visitedKeys.size),
  });

  trace.trackOpenSetSize(openEntries.size);
  trace.record({
    action: "init",
    priorityQueue: openSetSnapshot(openEntries),
    explanation: `Starting A* at (${startNode.row}, ${startNode.col}). g=0, h=${startH}, f=${startH}.`,
    pseudoCodeLine: ASTAR_LINES.PUSH_START,
    stats: buildStats(),
  });

  let pathFound = false;

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    const currentKey = keyOf(current.row, current.col);

    if (visitedKeys.has(currentKey)) {
      // A stale duplicate entry from an earlier, worse push — skip it.
      continue;
    }

    visitedKeys.add(currentKey);
    openEntries.delete(currentKey);

    if (currentKey !== startKey) {
      visitedNodesInOrder.push({ row: current.row, col: current.col });
    }

    const g = gScore.get(currentKey);
    const h = manhattanDistance(current, endNode);
    const currentNodeMeta = {
      ...toPlainNode(current),
      depth: g,
      distance: g,
      heuristic: h,
      fScore: g + h,
      parent: getParentNode(cameFrom, currentKey),
    };

    trace.record({
      action: "pop-heap",
      currentNode: currentNodeMeta,
      priorityQueue: openSetSnapshot(openEntries),
      explanation: `Popped node (${current.row}, ${current.col}) with the lowest f-score (f=${(g + h).toFixed(0)}).`,
      pseudoCodeLine: ASTAR_LINES.POP_LOWEST_F,
      stats: buildStats({ currentDepth: g }),
    });

    if (currentKey === endKey) {
      pathFound = true;
      trace.record({
        action: "goal-found",
        currentNode: currentNodeMeta,
        priorityQueue: openSetSnapshot(openEntries),
        explanation: `Destination node (${current.row}, ${current.col}) reached.`,
        pseudoCodeLine: ASTAR_LINES.CHECK_GOAL,
        stats: buildStats({ currentDepth: g }),
      });
      break;
    }

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const neighborKey = keyOf(neighbor.row, neighbor.col);
      const tentativeG = g + (neighbor.weight ?? 1);

      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, { node: neighbor, parentKey: currentKey });
        gScore.set(neighborKey, tentativeG);
        const neighborH = manhattanDistance(neighbor, endNode);
        const neighborF = tentativeG + neighborH;

        openSet.push(neighbor, neighborF);
        openEntries.set(neighborKey, { node: neighbor, g: tentativeG, h: neighborH, f: neighborF });
        trace.trackOpenSetSize(openEntries.size);

        trace.record({
          action: "push-heap",
          currentNode: currentNodeMeta,
          neighbor: { ...toPlainNode(neighbor), g: tentativeG, h: neighborH, f: neighborF },
          priorityQueue: openSetSnapshot(openEntries),
          explanation: `Neighbour (${neighbor.row}, ${neighbor.col}) improved: g=${tentativeG}, h=${neighborH}, f=${neighborF}. Added to the open set.`,
          pseudoCodeLine: ASTAR_LINES.PUSH_NEIGHBOR,
          stats: buildStats({ currentDepth: g }),
        });
      } else {
        trace.record({
          action: "skip-neighbor",
          currentNode: currentNodeMeta,
          neighbor: toPlainNode(neighbor),
          priorityQueue: openSetSnapshot(openEntries),
          explanation: `Neighbour (${neighbor.row}, ${neighbor.col}) already has a better or equal path — skipped.`,
          pseudoCodeLine: ASTAR_LINES.CHECK_BETTER_PATH,
          stats: buildStats({ currentDepth: g }),
        });
      }
    }
  }

  if (!pathFound) {
    trace.record({
      action: "no-path",
      priorityQueue: openSetSnapshot(openEntries),
      explanation: "The open set is empty — no path exists between Start and End.",
      pseudoCodeLine: ASTAR_LINES.RETURN_NO_PATH,
      stats: buildStats(),
    });
  }

  const shortestPath = pathFound ? reconstructPath(cameFrom, endKey) : [];

  shortestPath.forEach((node, i) => {
    trace.record({
      action: "reveal-path",
      currentNode: toPlainNode(node),
      explanation: `Path step ${i + 1} of ${shortestPath.length}: (${node.row}, ${node.col}).`,
      pseudoCodeLine: ASTAR_LINES.CHECK_GOAL,
      stats: buildStats({ pathLength: i + 1 }),
    });
  });

  const executionTimeMs = performance.now() - startTime;

  trace.record({
    action: "complete",
    priorityQueue: [],
    explanation: pathFound
      ? `Done. Visited ${visitedNodesInOrder.length} nodes; shortest path is ${shortestPath.length} nodes long.`
      : `Done. No path found after visiting ${visitedNodesInOrder.length} nodes.`,
    pseudoCodeLine: ASTAR_LINES.RETURN_NO_PATH,
    stats: buildStats({ pathLength: shortestPath.length }),
  });

  trace.patchAllStats({ executionTimeMs });

  return {
    visitedNodesInOrder,
    shortestPath,
    statistics: {
      algorithm: "A* Search",
      visitedCount: visitedNodesInOrder.length,
      pathLength: shortestPath.length,
      executionTimeMs,
      pathFound,
    },
    steps: trace.steps,
  };
}

export default { run };
