import { useCallback, useEffect, useRef, useState } from "react";
import { SPEED_PRESETS, DEFAULT_SPEED } from "../constants/colors.js";

/**
 * hooks/useLearningPlayer.js
 *
 * Drives Learning Mode's Execution Timeline. Owns exactly one piece of
 * truth — the current step index — and everything else (grid overlay,
 * current node panel, live data structure, statistics, pseudocode
 * highlight) is derived from `steps[currentIndex]` by the components
 * that render it. This is what keeps every part of Learning Mode in
 * sync: there is only one clock.
 */
export default function useLearningPlayer(steps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  const intervalRef = useRef(null);
  const stepCount = steps?.length ?? 0;

  const clampIndex = useCallback(
    (index) => Math.min(Math.max(index, 0), Math.max(stepCount - 1, 0)),
    [stepCount]
  );

  // Reset playback whenever a fresh trace comes in (new algorithm run).
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(intervalRef.current);
      return undefined;
    }

    const { stepDelayMs } = SPEED_PRESETS[speed] ?? SPEED_PRESETS[DEFAULT_SPEED];
    // Learning Mode reads slower than raw animation speed so explanations stay legible.
    const tickMs = Math.max(stepDelayMs * 4, 120);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= stepCount - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, tickMs);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, stepCount]);

  const play = useCallback(() => {
    if (stepCount === 0) return;
    setIsPlaying(true);
  }, [stepCount]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => (stepCount === 0 ? false : !prev));
  }, [stepCount]);

  const restart = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex((prev) => clampIndex(prev + 1));
  }, [clampIndex]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex((prev) => clampIndex(prev - 1));
  }, [clampIndex]);

  const seek = useCallback(
    (index) => {
      setIsPlaying(false);
      setCurrentIndex(clampIndex(index));
    },
    [clampIndex]
  );

  const currentStep = stepCount > 0 ? steps[currentIndex] : null;

  return {
    currentIndex,
    currentStep,
    stepCount,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    togglePlay,
    restart,
    stepForward,
    stepBackward,
    seek,
    isAtStart: currentIndex === 0,
    isAtEnd: stepCount === 0 || currentIndex >= stepCount - 1,
  };
}
