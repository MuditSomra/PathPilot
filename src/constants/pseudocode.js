/**
 * constants/pseudocode.js
 *
 * Single source of truth for the pseudocode text Learning Mode displays,
 * and the named line indices algorithms reference when recording a step
 * (so algorithm files never contain magic numbers like `pseudoCodeLine: 7`).
 */

export const BFS_PSEUDOCODE = [
  "function BFS(grid, start, end):",
  "  create empty Queue",
  "  enqueue(start); mark start visited",
  "  while Queue is not empty:",
  "    current = dequeue()",
  "    if current == end: return reconstructPath()",
  "    for each neighbour of current:",
  "      if neighbour is not visited:",
  "        mark neighbour visited; set parent",
  "        enqueue(neighbour)",
  "  return no path found",
];

export const BFS_LINES = Object.freeze({
  DECLARE: 0,
  CREATE_QUEUE: 1,
  ENQUEUE_START: 2,
  LOOP_WHILE_NOT_EMPTY: 3,
  DEQUEUE: 4,
  CHECK_GOAL: 5,
  FOR_EACH_NEIGHBOR: 6,
  CHECK_NEIGHBOR_VISITED: 7,
  MARK_NEIGHBOR_VISITED: 8,
  ENQUEUE_NEIGHBOR: 9,
  RETURN_NO_PATH: 10,
});

export const DFS_PSEUDOCODE = [
  "function DFS(grid, start, end):",
  "  create empty Stack",
  "  push(start)",
  "  while Stack is not empty:",
  "    current = pop()",
  "    if current is visited: continue",
  "    mark current visited",
  "    if current == end: return reconstructPath()",
  "    for each neighbour of current:",
  "      if neighbour is not visited:",
  "        push(neighbour); set parent",
  "  return no path found",
];

export const DFS_LINES = Object.freeze({
  DECLARE: 0,
  CREATE_STACK: 1,
  PUSH_START: 2,
  LOOP_WHILE_NOT_EMPTY: 3,
  POP: 4,
  SKIP_IF_VISITED: 5,
  MARK_VISITED: 6,
  CHECK_GOAL: 7,
  FOR_EACH_NEIGHBOR: 8,
  CHECK_NEIGHBOR_VISITED: 9,
  PUSH_NEIGHBOR: 10,
  RETURN_NO_PATH: 11,
});

export const ASTAR_PSEUDOCODE = [
  "function AStar(grid, start, end):",
  "  create empty PriorityQueue openSet",
  "  g[start] = 0; f[start] = heuristic(start, end)",
  "  openSet.push(start, f[start])",
  "  while openSet is not empty:",
  "    current = openSet.popLowestF()",
  "    if current is visited: continue",
  "    mark current visited",
  "    if current == end: return reconstructPath()",
  "    for each neighbour of current:",
  "      tentativeG = g[current] + weight(current, neighbour)",
  "      if tentativeG < g[neighbour]:",
  "        g[neighbour] = tentativeG",
  "        f[neighbour] = tentativeG + heuristic(neighbour, end)",
  "        openSet.push(neighbour, f[neighbour])",
  "  return no path found",
];

export const ASTAR_LINES = Object.freeze({
  DECLARE: 0,
  CREATE_OPEN_SET: 1,
  INIT_START_SCORES: 2,
  PUSH_START: 3,
  LOOP_WHILE_NOT_EMPTY: 4,
  POP_LOWEST_F: 5,
  SKIP_IF_VISITED: 6,
  MARK_VISITED: 7,
  CHECK_GOAL: 8,
  FOR_EACH_NEIGHBOR: 9,
  COMPUTE_TENTATIVE_G: 10,
  CHECK_BETTER_PATH: 11,
  UPDATE_G: 12,
  UPDATE_F: 13,
  PUSH_NEIGHBOR: 14,
  RETURN_NO_PATH: 15,
});

export const PSEUDOCODE_BY_ALGORITHM = Object.freeze({
  bfs: BFS_PSEUDOCODE,
  dfs: DFS_PSEUDOCODE,
  astar: ASTAR_PSEUDOCODE,
});
