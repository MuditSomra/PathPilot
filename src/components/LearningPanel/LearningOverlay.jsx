import React, { useEffect, useRef } from "react";
import PseudocodeViewer from "./PseudocodeViewer.jsx";
import TheorySection from "./TheorySection.jsx";

const TABS = [
  { id: "pseudocode", label: "Pseudocode" },
  { id: "theory", label: "Theory" },
];

/**
 * LearningOverlay — a standard centered, full-screen-dimmed modal that
 * hosts the Pseudocode and Theory sections on demand, instead of them
 * permanently occupying sidebar space. It's a thin shell: the actual
 * content is the existing PseudocodeViewer/TheorySection components,
 * reused unchanged.
 *
 * Because it's rendered with `fixed inset-0`, it escapes the Steps
 * sidebar's own `overflow-hidden`/scroll container and correctly
 * overlays the whole viewport (grid included) regardless of where in
 * the component tree it's mounted.
 *
 * Live sync: pseudoCodeLine keeps coming from the same `step` the rest
 * of Learning Mode uses, so the highlighted line stays correct even if
 * the user leaves this open while pressing Play, and reopening it later
 * always reflects the current step (there's no separate stale state).
 */
export default function LearningOverlay({ activeTab, onChangeTab, onClose, algorithmId, currentLine }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  if (!activeTab) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="learning-overlay-title"
        className="flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-pilot-surface"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
          <div role="tablist" aria-label="Learning content" className="flex rounded-md border border-slate-300 p-0.5 text-sm dark:border-slate-700">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`rounded px-3 py-1.5 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-teal-500 text-white dark:bg-pilot-accentDark"
                    : "text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-pilot-accent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h2 id="learning-overlay-title" className="sr-only">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4">
          {activeTab === "pseudocode" && <PseudocodeViewer algorithmId={algorithmId} currentLine={currentLine} />}
          {activeTab === "theory" && <TheorySection algorithmId={algorithmId} />}
        </div>
      </div>
    </div>
  );
}
