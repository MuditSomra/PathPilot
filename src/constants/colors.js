/**
 * constants/colors.js
 *
 * Single source of truth for every color token and speed preset used by
 * the renderer. Keeping these here means the visual language can change
 * without touching component logic (Separation of Concerns / SRP).
 */

export const CELL_TYPES = Object.freeze({
  EMPTY: "empty",
  WALL: "wall",
  START: "start",
  END: "end",
});

/**
 * Tailwind class fragments keyed by cell state. The renderer module
 * (core/renderer.js) composes these into a final className — this file
 * never imports React and never touches the DOM directly.
 */
export const CELL_STYLES = Object.freeze({
  base: "grid-cell w-full h-full transition-colors duration-150",
  empty: "bg-white dark:bg-slate-900",
  wall: "bg-slate-800 dark:bg-slate-950 border-slate-900 dark:border-black shadow-inner",
  start: "bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_0_2px_rgba(16,185,129,0.35)]",
  end: "bg-rose-500 dark:bg-rose-400 shadow-[0_0_0_2px_rgba(244,63,94,0.35)]",
  visited: "bg-teal-300/70 dark:bg-teal-500/40 animate-cell-visit",
  path: "bg-amber-400 dark:bg-amber-300 animate-cell-path",
});

/** Animation speed presets, expressed as a delay (ms) between animation steps. */
export const SPEED_PRESETS = Object.freeze({
  slow: { label: "Slow", stepDelayMs: 35, pathDelayMs: 60 },
  normal: { label: "Normal", stepDelayMs: 12, pathDelayMs: 35 },
  fast: { label: "Fast", stepDelayMs: 3, pathDelayMs: 15 },
});

export const DEFAULT_SPEED = "normal";

export const ALGORITHM_OPTIONS = Object.freeze([
  { id: "bfs", label: "Breadth First Search (BFS)" },
  { id: "dfs", label: "Depth First Search (DFS)" },
  { id: "astar", label: "A* Search" },
]);

export const DEFAULT_ALGORITHM = "bfs";

export const GRID_ROWS = 25;
export const GRID_COLS = 45;

export const APP_MODES = Object.freeze({
  VISUALIZER: "visualizer",
  LEARNING: "learning",
});

export const DEFAULT_APP_MODE = APP_MODES.VISUALIZER;
