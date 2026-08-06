import React from "react";

const ACTION_LABELS = {
  init: "Initialize",
  dequeue: "Dequeue",
  pop: "Pop",
  "pop-heap": "Pop (lowest f)",
  "goal-found": "Goal Reached",
  "enqueue": "Enqueue",
  push: "Push",
  "push-heap": "Push (open set)",
  "skip-neighbor": "Skip Neighbour",
  "skip-visited": "Skip (visited)",
  "no-path": "No Path",
  "reveal-path": "Reveal Path",
  complete: "Complete",
};

/**
 * CurrentStepExplanation — the plain-English narration of the current
 * animation frame (SRS "Current Step Explanation"). It only renders
 * `step.explanation` and `step.action` — it never derives or infers
 * behavior itself, since the algorithm already generated that text.
 */
export default function CurrentStepExplanation({ step }) {
  if (!step) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
        Click Visualize to start narrating each step.
      </section>
    );
  }

  return (
    <section
      aria-live="polite"
      aria-labelledby="learning-step-heading"
      className="rounded-lg border border-teal-200 bg-teal-50/70 px-3 py-2.5 dark:border-pilot-accent/30 dark:bg-pilot-accent/5"
    >
      <div className="flex items-center gap-2">
        <span className="rounded bg-teal-500 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-white dark:bg-pilot-accentDark">
          {ACTION_LABELS[step.action] ?? step.action}
        </span>
        <h3 id="learning-step-heading" className="font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Current Step
        </h3>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{step.explanation}</p>
    </section>
  );
}
