import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header/Header.jsx";
import Toolbar from "./components/Toolbar/Toolbar.jsx";
import Grid from "./components/Grid/Grid.jsx";
import Statistics from "./components/Statistics/Statistics.jsx";
import LearningPanel from "./components/LearningPanel/LearningPanel.jsx";
import useTheme from "./hooks/useTheme.js";
import useLearningPlayer from "./hooks/useLearningPlayer.js";
import {
  createGrid,
  cloneGrid,
  setWall,
  moveNode,
  clearPath,
  resetGrid as resetGridState,
  applyWallMask,
  findNodeByType,
  markVisited,
  markPath,
  buildGridForStep,
} from "./core/GridManager.js";
import { playAnimation } from "./core/AnimationManager.js";
import { generateMaze } from "./maze/recursiveBacktracking.js";
import bfs from "./algorithms/bfs.js";
import dfs from "./algorithms/dfs.js";
import astar from "./algorithms/astar.js";
import {
  CELL_TYPES,
  DEFAULT_ALGORITHM,
  DEFAULT_SPEED,
  GRID_ROWS,
  GRID_COLS,
  APP_MODES,
  DEFAULT_APP_MODE,
} from "./constants/colors.js";

const ALGORITHMS = { bfs, dfs, astar };

/**
 * App — owns every piece of application state (SRS §12) and wires the
 * presentational components together. Business logic itself always
 * lives in core/, algorithms/, and maze/; App only calls those modules
 * and stores their results.
 *
 * Learning Mode addition: algorithms now also return a `steps` trace.
 * In Visualizer Mode that field is simply unused — the original
 * AnimationManager playback path below is untouched. In Learning Mode,
 * `steps` becomes the single source of truth: useLearningPlayer tracks
 * "which step are we on", and a small effect re-derives the grid from
 * that step index via GridManager.buildGridForStep. Nothing about the
 * algorithms, GridManager's existing exports, or the Visualizer flow
 * had to change to support this.
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [grid, setGrid] = useState(() => createGrid(GRID_ROWS, GRID_COLS));
  const [algorithm, setAlgorithm] = useState(DEFAULT_ALGORITHM);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [statistics, setStatistics] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [mode, setMode] = useState(DEFAULT_APP_MODE);
  const [learningSteps, setLearningSteps] = useState([]);

  const cancelAnimationRef = useRef(null);
  const statusTimeoutRef = useRef(null);
  const learningBaseGridRef = useRef(null);

  const learningPlayer = useLearningPlayer(learningSteps);
  const isLearningMode = mode === APP_MODES.LEARNING;
  const hasLearningRun = learningSteps.length > 0;

  const showStatus = useCallback((message) => {
    setStatusMessage(message);
    clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => setStatusMessage(null), 3200);
  }, []);

  useEffect(
    () => () => {
      cancelAnimationRef.current?.();
      clearTimeout(statusTimeoutRef.current);
    },
    []
  );

  // Learning Mode's single synchronization point: whenever the timeline
  // moves to a different step, re-derive the grid from that step index.
  // Every other Learning Panel section reads learningPlayer.currentStep
  // directly, so this effect is the only place the grid itself updates.
  useEffect(() => {
    if (!isLearningMode || !learningBaseGridRef.current || learningSteps.length === 0) return;
    const nextGrid = buildGridForStep(learningBaseGridRef.current, learningSteps, learningPlayer.currentIndex);
    setGrid(nextGrid);
  }, [isLearningMode, learningSteps, learningPlayer.currentIndex]);

  const resetLearningRun = useCallback(() => {
    setLearningSteps([]);
    learningBaseGridRef.current = null;
  }, []);

  const handleModeChange = useCallback(
    (nextMode) => {
      if (isAnimating || nextMode === mode) return;
      cancelAnimationRef.current?.();
      setIsAnimating(false);
      resetLearningRun();
      setStatistics(null);
      setGrid((prev) => clearPath(prev));
      setMode(nextMode);
    },
    [isAnimating, mode, resetLearningRun]
  );

  const handleWallChange = useCallback(
    (row, col, shouldBeWall) => {
      if (isAnimating || (isLearningMode && hasLearningRun)) return;
      setGrid((prev) => setWall(prev, row, col, shouldBeWall));
    },
    [hasLearningRun, isAnimating, isLearningMode]
  );

  const handleNodeMove = useCallback(
    (nodeType, row, col) => {
      if (isAnimating || (isLearningMode && hasLearningRun)) return;
      setGrid((prev) => moveNode(prev, nodeType, row, col));
    },
    [hasLearningRun, isAnimating, isLearningMode]
  );

  const handleClearPath = useCallback(() => {
    if (isAnimating) return;
    resetLearningRun();
    setGrid((prev) => clearPath(prev));
    setStatistics(null);
  }, [isAnimating, resetLearningRun]);

  const handleResetGrid = useCallback(() => {
    if (isAnimating) return;
    resetLearningRun();
    setGrid(resetGridState(GRID_ROWS, GRID_COLS));
    setStatistics(null);
    showStatus("Grid reset.");
  }, [isAnimating, resetLearningRun, showStatus]);

  const handleGenerateMaze = useCallback(() => {
    if (isAnimating || (isLearningMode && hasLearningRun)) return;
    const startNode = findNodeByType(grid, CELL_TYPES.START);
    const endNode = findNodeByType(grid, CELL_TYPES.END);
    if (!startNode || !endNode) return;

    const wallMask = generateMaze(GRID_ROWS, GRID_COLS, startNode, endNode);
    setGrid((prev) => applyWallMask(prev, wallMask));
    setStatistics(null);
    showStatus("Maze generated.");
  }, [grid, hasLearningRun, isAnimating, isLearningMode, showStatus]);

  const handleAlgorithmChange = useCallback(
    (nextAlgorithm) => {
      if (isAnimating) return;
      setAlgorithm(nextAlgorithm);
      if (isLearningMode && hasLearningRun) {
        resetLearningRun();
        setGrid((prev) => clearPath(prev));
        setStatistics(null);
      }
    },
    [hasLearningRun, isAnimating, isLearningMode, resetLearningRun]
  );

  const runAlgorithm = useCallback(() => {
    const startNode = findNodeByType(grid, CELL_TYPES.START);
    const endNode = findNodeByType(grid, CELL_TYPES.END);

    if (!startNode) {
      showStatus("Place a Start node before visualizing.");
      return null;
    }
    if (!endNode) {
      showStatus("Place an End node before visualizing.");
      return null;
    }

    const clearedGrid = clearPath(grid);
    const algorithmModule = ALGORITHMS[algorithm];
    const result = algorithmModule.run(cloneGrid(clearedGrid), startNode, endNode);
    return { clearedGrid, result };
  }, [algorithm, grid, showStatus]);

  const handleVisualizeVisualizerMode = useCallback(() => {
    const prepared = runAlgorithm();
    if (!prepared) return;
    const { clearedGrid, result } = prepared;

    setGrid(clearedGrid);
    setStatistics(null);
    setIsAnimating(true);

    cancelAnimationRef.current = playAnimation({
      visitedNodesInOrder: result.visitedNodesInOrder,
      shortestPath: result.shortestPath,
      speed,
      onVisit: (node) => setGrid((prev) => markVisited(prev, node.row, node.col)),
      onPath: (node) => setGrid((prev) => markPath(prev, node.row, node.col)),
      onComplete: () => {
        setIsAnimating(false);
        setStatistics(result.statistics);
        if (!result.statistics.pathFound) {
          showStatus("No valid path exists between Start and End.");
        }
      },
    });
  }, [runAlgorithm, showStatus, speed]);

  const handleVisualizeLearningMode = useCallback(() => {
    const prepared = runAlgorithm();
    if (!prepared) return;
    const { clearedGrid, result } = prepared;

    learningBaseGridRef.current = clearedGrid;
    setGrid(clearedGrid);
    setStatistics(result.statistics);
    setLearningSteps(result.steps);

    if (!result.statistics.pathFound) {
      showStatus("No valid path exists between Start and End.");
    }
  }, [runAlgorithm, showStatus]);

  const handleVisualize = useCallback(() => {
    if (isAnimating) {
      showStatus("Already visualizing — please wait.");
      return;
    }
    if (isLearningMode) {
      handleVisualizeLearningMode();
    } else {
      handleVisualizeVisualizerMode();
    }
  }, [handleVisualizeLearningMode, handleVisualizeVisualizerMode, isAnimating, isLearningMode, showStatus]);

  const isGridLocked = isAnimating || (isLearningMode && hasLearningRun);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-pilot-bg">
      <Header />
      <Toolbar
        algorithm={algorithm}
        onAlgorithmChange={handleAlgorithmChange}
        speed={speed}
        onSpeedChange={setSpeed}
        onVisualize={handleVisualize}
        onGenerateMaze={handleGenerateMaze}
        onClearPath={handleClearPath}
        onResetGrid={handleResetGrid}
        isAnimating={isAnimating}
        theme={theme}
        onToggleTheme={toggleTheme}
        mode={mode}
        onModeChange={handleModeChange}
      />

      <div className="flex flex-1 flex-col lg:flex-row">
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-6">
          <div className="mb-4">
            <Statistics statistics={statistics} />
          </div>

          <div className="overflow-x-auto pb-2">
            <Grid grid={grid} isAnimating={isGridLocked} onWallChange={handleWallChange} onNodeMove={handleNodeMove} />
          </div>

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            Left click + drag to draw walls · Right click + drag to erase · Drag the green/red nodes to move Start/End.
          </p>
        </main>

        {isLearningMode && (
          <div className="lg:h-[calc(100vh-116px)]">
            <LearningPanel algorithmId={algorithm} player={learningPlayer} />
          </div>
        )}
      </div>

      {statusMessage && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
