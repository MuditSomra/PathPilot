import React, { useState } from "react";
import AlgorithmOverview from "./AlgorithmOverview.jsx";
import CurrentStepExplanation from "./CurrentStepExplanation.jsx";
import CurrentNodeInfo from "./CurrentNodeInfo.jsx";
import LiveDataStructure from "./LiveDataStructure.jsx";
import LearningStatistics from "./LearningStatistics.jsx";
import ExecutionTimeline from "./ExecutionTimeline.jsx";
import LearningOverlay from "./LearningOverlay.jsx";

const overlayTriggerClass =
  "flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-pilot-accent dark:hover:text-pilot-accent";

/**
 * LearningPanel — the "Steps" sidebar: every section that updates live
 * as the animation plays (explanation, current node, data structure,
 * statistics), plus the Execution Timeline that drives them all. It
 * owns only UI-level state — expand/collapse for small screens, and
 * which overlay (if any) is open. Every piece of algorithm truth still
 * comes from `player.currentStep`, passed down from App.jsx.
 *
 * Pseudocode and Theory are no longer permanent sidebar sections — they
 * live in LearningOverlay, a centered modal opened on demand via the
 * two buttons in the header. This keeps the sidebar focused on "watch
 * it run" content and gives the reference material (which is long) its
 * own dedicated, full-width reading space instead of fighting for
 * scroll room.
 *
 * Responsive behavior:
 *  - Desktop (lg+): fixed-width sidebar to the right of the grid, always expanded.
 *  - Tablet: same sidebar, but collapsible via the header.
 *  - Mobile: becomes a bottom drawer/sheet. The header (including the
 *    Pseudocode/Theory buttons) stays reachable even while collapsed.
 */
export default function LearningPanel({ algorithmId, player }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [overlayTab, setOverlayTab] = useState(null); // 'pseudocode' | 'theory' | null
  const step = player.currentStep;

  return (
    <>
      <aside
        aria-label="Learning Mode panel"
        className={`z-30 flex flex-col border-slate-200 bg-white dark:border-slate-800 dark:bg-pilot-surface
          fixed inset-x-0 bottom-0 rounded-t-2xl border-t shadow-[0_-4px_24px_rgba(0,0,0,0.08)]
          lg:static lg:inset-auto lg:w-[440px] lg:shrink-0 lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-none
          ${isExpanded ? "max-h-[78vh]" : "max-h-[6.5rem]"} lg:max-h-none overflow-hidden transition-[max-height] duration-300 ease-in-out`}
      >
        <div className="shrink-0 border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="flex w-full items-center justify-between px-4 pt-3 pb-1.5 text-left lg:cursor-default"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-500 dark:bg-pilot-accent" />
              <h2 className="font-display text-sm font-semibold text-slate-800 dark:text-slate-100">Learning Mode</h2>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`h-4 w-4 text-slate-400 transition-transform lg:hidden ${isExpanded ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2 px-4 pb-3">
            <button type="button" onClick={() => setOverlayTab("pseudocode")} className={overlayTriggerClass}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
              </svg>
              Pseudocode
            </button>
            <button type="button" onClick={() => setOverlayTab("theory")} className={overlayTriggerClass}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5C10.5 5 8.5 4 6 4 4.5 4 3 4.3 3 4.3v13S4.5 17 6 17c2.5 0 4.5 1 6 2.5M12 6.5C13.5 5 15.5 4 18 4c1.5 0 3 .3 3 .3v13S19.5 17 18 17c-2.5 0-4.5 1-6 2.5M12 6.5v13" />
              </svg>
              Theory
            </button>
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto px-4 py-3">
          <AlgorithmOverview algorithmId={algorithmId} />
          <ExecutionTimeline player={player} />
          <CurrentStepExplanation step={step} />
          <CurrentNodeInfo node={step?.currentNode} />
          <LiveDataStructure algorithmId={algorithmId} step={step} />
          <LearningStatistics step={step} stepCount={player.stepCount} />
        </div>
      </aside>

      <LearningOverlay
        activeTab={overlayTab}
        onChangeTab={setOverlayTab}
        onClose={() => setOverlayTab(null)}
        algorithmId={algorithmId}
        currentLine={step?.pseudoCodeLine}
      />
    </>
  );
}
