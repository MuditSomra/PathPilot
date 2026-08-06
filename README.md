# PathPilot — Interactive Pathfinding Visualizer

PathPilot is a desktop-first React application for visualizing and comparing
pathfinding algorithms — **Breadth First Search**, **Depth First Search**,
and **A\*** — on an interactive grid, with maze generation, live statistics,
and a persisted light/dark theme.

Built to be interview-ready: every algorithm is a pure, framework-agnostic
function, and the UI layer never leaks business logic into components.

## Features

- Click-and-drag wall drawing, right-click-and-drag erasing
- Draggable Start / End nodes
- BFS, DFS, and A* (Manhattan-heuristic) with animated playback
- Recursive Backtracking maze generation
- Live statistics: visited nodes, path length, execution time, path found/not
- Adjustable animation speed
- Light / dark theme, persisted to Local Storage
- Reset Grid / Clear Path controls
- Controls disable automatically while an animation is running

## Tech Stack

React · Vite · Tailwind CSS · JavaScript (no TypeScript, no state library)

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Architecture

```
React Components  →  Grid Manager  →  Algorithms  →  Animation Engine  →  Renderer
```

Algorithms **never** import React or touch the DOM. Every algorithm module
implements the same interface:

```js
run(grid, startNode, endNode)
// -> { visitedNodesInOrder, shortestPath, statistics }
```

`core/AnimationManager.js` takes that plain-data output and schedules
`setTimeout`-based playback via callbacks; `core/renderer.js` turns a cell's
state into a Tailwind className. Neither module knows React exists — App.jsx
is the only place algorithm output, animation timing, and React state meet.

See `docs/SRS.md` and `docs/Architecture.md` for the full requirements and
architecture decision record this project was built against.

## Project Structure

```
src/
  components/   Header, Toolbar, Grid, Cell, Statistics, ThemeToggle, LearningPanel/
  algorithms/   bfs.js, dfs.js, astar.js — pure, React-free
  maze/         recursiveBacktracking.js
  core/         GridManager.js, AnimationManager.js, renderer.js, algorithmTrace.js
  utils/        Queue.js, PriorityQueue.js
  hooks/        useTheme.js, useLearningPlayer.js
  constants/    colors.js, pseudocode.js, theory.js
```

## Learning Mode

PathPilot has two modes, toggled in the toolbar:

- **Visualizer Mode** — the original experience, unchanged.
- **Learning Mode** — opens a responsive side panel (bottom drawer on
  mobile) that teaches *how* the selected algorithm works while it runs:
  algorithm theory, a live explanation of the current step, the active
  node's details, the algorithm's live internal data structure (queue /
  stack / priority queue), live statistics, a pseudocode viewer with the
  executing line highlighted, and a full scrub/replay timeline.

**How it stays in sync:** algorithms (`bfs.js`/`dfs.js`/`astar.js`) now
return an additional `steps` array — one richly-annotated object per
meaningful event (dequeue, enqueue, examine neighbour, goal reached...),
each carrying its own explanation, pseudocode line, data-structure
snapshot, and statistics. `useLearningPlayer` owns a single "current step
index" as the one source of truth; every Learning Panel section (and the
grid itself, via `GridManager.buildGridForStep`) is a pure function of
that index. There's only one clock, so nothing can drift out of sync,
and scrubbing the timeline to an arbitrary step works exactly like
playing forward to it.

This is additive: `visitedNodesInOrder`, `shortestPath`, and
`statistics` — the fields Visualizer Mode's `AnimationManager` reads —
are untouched, so Visualizer Mode behaves exactly as before.

Adding a future algorithm (Dijkstra, Greedy Best-First, Bidirectional
BFS, ...) only requires: implementing `run()` with the same step-trace
pattern, adding its pseudocode to `constants/pseudocode.js`, and adding
its writeup to `constants/theory.js`. No Learning Panel component needs
to change.

## Engineering Decisions (ambiguity resolutions)

A few points in the SRS were open to interpretation. Decisions made, and why:

- **Default grid size (25×45)** was kept odd × odd on purpose — Recursive
  Backtracking maze generation naturally produces clean single-width
  corridors on odd-numbered grids.
- **`hooks/`** contains only `useTheme.js` as specified; grid/animation state
  is owned directly by `App.jsx` calling into `core/` and `algorithms/`, to
  keep the state-ownership story in one place per SRS §12.
- **`core/renderer.js`** is a pure function module (cell state → className),
  not a DOM-writing renderer — React remains the sole thing that touches the
  DOM, per ADR-004/§7 ("Algorithms/engine never know React exists").
- **DFS's "shortest path"** is the path DFS actually found via its traversal
  order, not a guaranteed-shortest path — this is expected DFS behavior and
  is left visible for educational contrast with BFS/A*.
- **Toast/status messages** (SRS §13) are implemented as local `App.jsx`
  state rather than a new component folder, to avoid deviating from the
  folder structure specified in SRS §5.

## Deployment

Deploys as a static Vite build — push to GitHub and import the repo into
Vercel with the default settings (`npm run build`, output directory `dist`).

## License

MIT — see `LICENSE`.
