import React, { useState } from "react";
import { ALGORITHM_THEORY } from "../../constants/theory.js";

function TheoryBlock({ label, children }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</h4>
      <div className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</div>
    </div>
  );
}

function TheoryList({ label, items }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</h4>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * TheorySection — full educational writeup for the selected algorithm
 * (SRS: "What is it / How it works / Why / complexity / pros & cons /
 * real-world applications"). Reads from constants/theory.js, so adding
 * a future algorithm (Dijkstra, GBFS, ...) only requires adding an
 * entry there — this component needs no changes.
 */
export default function TheorySection({ algorithmId }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const theory = ALGORITHM_THEORY[algorithmId];
  if (!theory) return null;

  return (
    <section aria-labelledby="learning-theory-heading" className="rounded-lg border border-slate-200 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
      >
        <h3 id="learning-theory-heading" className="font-display text-sm font-semibold text-slate-800 dark:text-slate-100">
          Theory
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-3 border-t border-slate-200 px-3 py-3 dark:border-slate-800">
          <TheoryBlock label="What is it?">{theory.whatIsIt}</TheoryBlock>
          <TheoryBlock label="How it works">{theory.howItWorks}</TheoryBlock>
          <TheoryBlock label="Why it behaves this way">{theory.why}</TheoryBlock>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TheoryBlock label="Time Complexity">
              <code className="font-mono text-xs">{theory.timeComplexity}</code>
            </TheoryBlock>
            <TheoryBlock label="Space Complexity">
              <code className="font-mono text-xs">{theory.spaceComplexity}</code>
            </TheoryBlock>
          </div>
          <TheoryList label="Advantages" items={theory.advantages} />
          <TheoryList label="Disadvantages" items={theory.disadvantages} />
          <TheoryList label="Real-world applications" items={theory.realWorldApplications} />
        </div>
      )}
    </section>
  );
}
