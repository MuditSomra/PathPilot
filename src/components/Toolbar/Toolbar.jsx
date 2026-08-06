import React from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import { ALGORITHM_OPTIONS, SPEED_PRESETS, APP_MODES } from "../../constants/colors.js";

const buttonBase =
  "rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Toolbar — houses the algorithm dropdown, speed control, mode toggle,
 * and every action button (FR-5, FR-6, FR-8, FR-10). It owns no state
 * of its own; every value and handler is passed down from App.
 */
export default function Toolbar({
  algorithm,
  onAlgorithmChange,
  speed,
  onSpeedChange,
  onVisualize,
  onGenerateMaze,
  onClearPath,
  onResetGrid,
  isAnimating,
  theme,
  onToggleTheme,
  mode,
  onModeChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-pilot-surface">
      <div
        role="radiogroup"
        aria-label="Application mode"
        className="flex rounded-md border border-slate-300 p-0.5 text-sm dark:border-slate-700"
      >
        {[
          { id: APP_MODES.VISUALIZER, label: "Visualizer" },
          { id: APP_MODES.LEARNING, label: "Learning Mode" },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={mode === option.id}
            disabled={isAnimating}
            onClick={() => onModeChange(option.id)}
            className={`rounded px-3 py-1.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              mode === option.id
                ? "bg-teal-500 text-white dark:bg-pilot-accentDark dark:text-white"
                : "text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-pilot-accent"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />

      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span className="font-medium">Algorithm</span>
        <select
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          disabled={isAnimating}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {ALGORITHM_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span className="font-medium">Speed</span>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(e.target.value)}
          disabled={isAnimating}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {Object.entries(SPEED_PRESETS).map(([key, preset]) => (
            <option key={key} value={key}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>

      <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />

      <button
        type="button"
        onClick={onVisualize}
        disabled={isAnimating}
        className={`${buttonBase} bg-teal-500 text-white hover:bg-teal-600 dark:bg-pilot-accentDark dark:hover:bg-pilot-accent dark:hover:text-slate-900`}
      >
        {isAnimating ? "Visualizing…" : "Visualize"}
      </button>

      <button
        type="button"
        onClick={onGenerateMaze}
        disabled={isAnimating}
        className={`${buttonBase} border border-slate-300 text-slate-700 hover:border-teal-400 hover:text-teal-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-pilot-accent dark:hover:text-pilot-accent`}
      >
        Generate Maze
      </button>

      <button
        type="button"
        onClick={onClearPath}
        disabled={isAnimating}
        className={`${buttonBase} border border-slate-300 text-slate-700 hover:border-teal-400 hover:text-teal-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-pilot-accent dark:hover:text-pilot-accent`}
      >
        Clear Path
      </button>

      <button
        type="button"
        onClick={onResetGrid}
        disabled={isAnimating}
        className={`${buttonBase} border border-slate-300 text-slate-700 hover:border-rose-400 hover:text-rose-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-rose-400 dark:hover:text-rose-400`}
      >
        Reset Grid
      </button>

      <div className="ml-auto">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}
