/**
 * core/AnimationManager.js
 *
 * Takes the plain-data output of an algorithm (visitedNodesInOrder,
 * shortestPath) and plays it back over time via callbacks. This module
 * has no idea React exists — it just schedules timeouts and invokes the
 * callbacks it's given (ADR-005). App.jsx wires the callbacks to
 * setState calls.
 */
import { SPEED_PRESETS, DEFAULT_SPEED } from "../constants/colors.js";

/**
 * @param {Object} options
 * @param {{row:number,col:number}[]} options.visitedNodesInOrder
 * @param {{row:number,col:number}[]} options.shortestPath
 * @param {keyof SPEED_PRESETS} options.speed
 * @param {(node:{row:number,col:number}) => void} options.onVisit - called once per visited node, in order
 * @param {(node:{row:number,col:number}) => void} options.onPath - called once per shortest-path node, in order
 * @param {() => void} options.onComplete - called once the whole animation finishes
 * @returns {() => void} cancel function
 */
export function playAnimation({
  visitedNodesInOrder,
  shortestPath,
  speed = DEFAULT_SPEED,
  onVisit,
  onPath,
  onComplete,
}) {
  const { stepDelayMs, pathDelayMs } = SPEED_PRESETS[speed] ?? SPEED_PRESETS[DEFAULT_SPEED];
  const timeoutIds = [];
  let cancelled = false;

  visitedNodesInOrder.forEach((node, index) => {
    const id = setTimeout(() => {
      if (cancelled) return;
      onVisit?.(node);
    }, index * stepDelayMs);
    timeoutIds.push(id);
  });

  const visitedPhaseDuration = visitedNodesInOrder.length * stepDelayMs;

  shortestPath.forEach((node, index) => {
    const id = setTimeout(() => {
      if (cancelled) return;
      onPath?.(node);
    }, visitedPhaseDuration + index * pathDelayMs);
    timeoutIds.push(id);
  });

  const totalDuration = visitedPhaseDuration + shortestPath.length * pathDelayMs;
  const completionId = setTimeout(() => {
    if (cancelled) return;
    onComplete?.();
  }, totalDuration + 30);
  timeoutIds.push(completionId);

  return function cancel() {
    cancelled = true;
    timeoutIds.forEach(clearTimeout);
  };
}

export default { playAnimation };
