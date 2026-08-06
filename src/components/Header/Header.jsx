import React from "react";

/**
 * Header — static presentational banner. Owns no state.
 */
export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-pilot-surface/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Path<span className="text-teal-500 dark:text-pilot-accent">Pilot</span>
          </h1>
          <span className="hidden font-mono text-xs text-slate-400 sm:inline dark:text-slate-500">
            interactive pathfinding visualizer
          </span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-pilot-accent dark:hover:text-pilot-accent"
        >
          View Source
        </a>
      </div>
    </header>
  );
}
