import React from "react";
import { SPEED_PRESETS } from "../../constants/colors.js";

const iconButtonClass =
  "flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:text-slate-300 dark:hover:border-pilot-accent dark:hover:text-pilot-accent";

/**
 * ExecutionTimeline — the single control surface for Learning Mode
 * replay. Every control here calls into `player` (a useLearningPlayer
 * instance) which owns the one true "current step index" — this
 * component contains no algorithm awareness of its own.
 */
export default function ExecutionTimeline({ player }) {
  const { currentIndex, stepCount, isPlaying, speed, setSpeed, togglePlay, restart, stepForward, stepBackward, seek, isAtStart, isAtEnd } =
    player;

  const hasSteps = stepCount > 0;

  return (
    <section aria-labelledby="learning-timeline-heading" className="rounded-lg border border-slate-200 px-3 py-2.5 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h3 id="learning-timeline-heading" className="font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Execution Timeline
        </h3>
        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
          {hasSteps ? `${currentIndex + 1} / ${stepCount}` : "0 / 0"}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(stepCount - 1, 0)}
        value={currentIndex}
        disabled={!hasSteps}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Scrub to animation step"
        className="my-2.5 w-full accent-teal-500 disabled:opacity-40 dark:accent-pilot-accent"
      />

      <div className="flex items-center gap-1.5">
        <button type="button" onClick={restart} disabled={!hasSteps} aria-label="Restart" className={iconButtonClass}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 1 3 6.7M3 12V6m0 6h6" />
          </svg>
        </button>

        <button type="button" onClick={stepBackward} disabled={!hasSteps || isAtStart} aria-label="Previous step" className={iconButtonClass}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M6 5h2v14H6zM19 6l-9 6 9 6z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={togglePlay}
          disabled={!hasSteps}
          aria-label={isPlaying ? "Pause" : "Play"}
          className={`${iconButtonClass} w-14 border-teal-400 text-teal-600 dark:border-pilot-accent dark:text-pilot-accent`}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M7 5l12 7-12 7z" />
            </svg>
          )}
        </button>

        <button type="button" onClick={stepForward} disabled={!hasSteps || isAtEnd} aria-label="Next step" className={iconButtonClass}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M16 5h2v14h-2zM5 6l9 6-9 6z" />
          </svg>
        </button>

        <select
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          aria-label="Playback speed"
          className="ml-auto rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          {Object.entries(SPEED_PRESETS).map(([key, preset]) => (
            <option key={key} value={key}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
