import React from "react";
import { PSEUDOCODE_BY_ALGORITHM } from "../../constants/pseudocode.js";

/**
 * PseudocodeViewer — renders the algorithm's pseudocode and highlights
 * whichever line the current step is executing (SRS "Pseudocode
 * Viewer"). The line index comes directly from the step object
 * (`pseudoCodeLine`), set by the algorithm itself — this component
 * never guesses which line is "probably" running.
 */
export default function PseudocodeViewer({ algorithmId, currentLine }) {
  const lines = PSEUDOCODE_BY_ALGORITHM[algorithmId] ?? [];

  return (
    <section aria-labelledby="learning-pseudocode-heading" className="rounded-lg border border-slate-200 dark:border-slate-800">
      <h3
        id="learning-pseudocode-heading"
        className="border-b border-slate-200 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500"
      >
        Pseudocode
      </h3>
      <pre className="overflow-x-auto px-1 py-2 font-mono text-[12.5px] leading-relaxed">
        {lines.map((line, index) => (
          <div
            key={index}
            aria-current={index === currentLine ? "step" : undefined}
            className={`whitespace-pre rounded px-2 py-0.5 ${
              index === currentLine
                ? "bg-teal-500/15 text-teal-700 dark:bg-pilot-accent/20 dark:text-pilot-accent"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {line}
          </div>
        ))}
      </pre>
    </section>
  );
}
