/**
 * constants/theory.js
 *
 * Educational copy for Learning Mode's Theory and Overview sections.
 * Plain data only — no React, no logic — so it can be extended for
 * future algorithms (Dijkstra, GBFS, Bidirectional BFS, ...) by simply
 * adding another entry here.
 */

export const ALGORITHM_THEORY = Object.freeze({
  bfs: {
    id: "bfs",
    name: "Breadth First Search",
    shortLabel: "BFS",
    tagline: "Explores the grid one full ring of distance at a time.",
    whatIsIt:
      "Breadth First Search is a graph traversal algorithm that explores neighbouring nodes before moving further away, using a First-In-First-Out (FIFO) queue to decide what to visit next.",
    howItWorks:
      "Starting from the Start node, BFS enqueues it and marks it visited. It then repeatedly dequeues the node at the front of the queue, checks whether it's the destination, and enqueues every unvisited neighbour. Because the queue is FIFO, all nodes at distance 1 are processed before any node at distance 2, and so on.",
    why:
      "Processing nodes in strict distance order is exactly what guarantees the first time BFS reaches the End node, it has done so via the fewest possible edges — there is no shorter route it could have missed, because every shorter-length route was already fully explored first.",
    timeComplexity: "O(V + E) — every vertex and edge is processed at most once.",
    spaceComplexity: "O(V) — the queue and visited set can hold up to every vertex.",
    advantages: [
      "Guarantees the shortest path on unweighted graphs.",
      "Simple to implement and reason about.",
      "Predictable, uniform memory growth per layer.",
    ],
    disadvantages: [
      "Explores in every direction equally — no sense of 'closer to the goal'.",
      "Can use significant memory on wide graphs (large queue).",
      "Not directly usable on weighted graphs without modification.",
    ],
    realWorldApplications: [
      "Shortest hop-count routing in unweighted networks.",
      "Finding the shortest chain of connections (e.g. social network 'degrees of separation').",
      "Web crawlers exploring links level by level.",
      "Puzzle solvers where every move costs the same (e.g. sliding puzzles).",
    ],
  },

  dfs: {
    id: "dfs",
    name: "Depth First Search",
    shortLabel: "DFS",
    tagline: "Commits to a direction and backtracks only when it hits a wall.",
    whatIsIt:
      "Depth First Search is a graph traversal algorithm that explores as far as possible along each branch before backtracking, using a Last-In-First-Out (LIFO) stack to decide what to visit next.",
    howItWorks:
      "Starting from the Start node, DFS pushes it onto a stack. It repeatedly pops the most recently pushed node; if unvisited, it marks that node visited and pushes all of its unvisited neighbours. Because the stack is LIFO, DFS keeps 'diving deeper' into whichever neighbour it pushed last, only backtracking once it runs out of new nodes along that branch.",
    why:
      "DFS behaves this way because a stack always resurfaces the most recently discovered node first — it has no concept of 'distance so far', so it commits fully to one path before being forced back by dead ends. This is why the path DFS finds is rarely the shortest one.",
    timeComplexity: "O(V + E) — every vertex and edge is processed at most once.",
    spaceComplexity: "O(V) in the worst case, for the stack and visited set.",
    advantages: [
      "Low overhead — a simple stack is all that's needed.",
      "Can be implemented recursively with minimal code.",
      "Well suited to problems about reachability or existence of a path, not its length.",
    ],
    disadvantages: [
      "Does not guarantee the shortest path.",
      "Can go very deep down an unproductive branch before backtracking.",
      "Recursive implementations risk stack overflow on very large/deep graphs.",
    ],
    realWorldApplications: [
      "Maze solving where any valid path is acceptable.",
      "Cycle detection in graphs.",
      "Topological sorting of dependency graphs.",
      "Exploring file system trees or nested data structures.",
    ],
  },

  astar: {
    id: "astar",
    name: "A* Search",
    shortLabel: "A*",
    tagline: "Uses a smart estimate of remaining distance to search toward the goal.",
    whatIsIt:
      "A* (pronounced 'A-star') is an informed search algorithm that finds the shortest path by combining the actual cost from the start (g) with an estimated cost to the goal (h), always expanding the node with the lowest total estimated cost (f = g + h).",
    howItWorks:
      "A* keeps a priority queue ('open set') ordered by f-score. It repeatedly pops the node with the lowest f, and for each neighbour computes a tentative g-score (cost so far). If that's better than any previously known route to the neighbour, it updates the neighbour's g and f scores and pushes it into the open set. PathPilot uses Manhattan distance as the heuristic (h), since only 4-directional movement is allowed.",
    why:
      "Because the heuristic never overestimates the true remaining distance (it's 'admissible'), A* is guaranteed to still find the optimal path — but by preferring nodes that look closer to the goal, it typically explores far fewer nodes than BFS to get there.",
    timeComplexity: "O(E log V) with a binary-heap priority queue, though the effective node count explored is usually far smaller than BFS thanks to the heuristic.",
    spaceComplexity: "O(V) — for the open set, g-scores, and visited set.",
    advantages: [
      "Guarantees the shortest path when the heuristic is admissible.",
      "Usually visits dramatically fewer nodes than BFS on open or sparse grids.",
      "Generalizes to weighted graphs, unlike plain BFS.",
    ],
    disadvantages: [
      "More complex to implement correctly (heuristic design matters).",
      "Priority queue operations add constant-factor overhead per step.",
      "A poorly chosen (non-admissible) heuristic can produce a suboptimal path.",
    ],
    realWorldApplications: [
      "Turn-by-turn GPS and game-map pathfinding.",
      "Robotics motion planning.",
      "Puzzle solvers (e.g. 15-puzzle) with an admissible heuristic.",
      "Network packet routing with cost-aware heuristics.",
    ],
  },
});

export default ALGORITHM_THEORY;
