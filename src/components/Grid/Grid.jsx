import React, { useCallback, useEffect, useRef } from "react";
import Cell from "../Cell/Cell.jsx";
import { CELL_TYPES } from "../../constants/colors.js";

/**
 * Grid — displays cells and delegates every click/drag to a single set
 * of container-level listeners (event delegation), rather than wiring a
 * handler onto every one of the ~1000 Cell components. This keeps Cell
 * dumb and rendering fast (SRS §6 "Grid: Displays cells. Delegates
 * clicks.").
 *
 * Interaction rules (FR-2, FR-3, FR-4):
 *  - Left click + drag on empty/wall cells -> draw walls
 *  - Right click + drag -> erase walls
 *  - Mouse down on Start/End -> drag that node to a new cell
 */
export default function Grid({ grid, isAnimating, onWallChange, onNodeMove }) {
  const dragModeRef = useRef(null); // 'wall' | 'erase' | 'moveStart' | 'moveEnd' | null

  const resolveCellFromEvent = useCallback((event) => {
    const target = event.target.closest("[data-row]");
    if (!target) return null;
    return { row: Number(target.dataset.row), col: Number(target.dataset.col) };
  }, []);

  const handleMouseDown = useCallback(
    (event) => {
      if (isAnimating) return;
      const position = resolveCellFromEvent(event);
      if (!position) return;
      const cell = grid[position.row][position.col];

      if (event.button === 2) {
        dragModeRef.current = "erase";
        onWallChange(position.row, position.col, false);
        return;
      }

      if (cell.type === CELL_TYPES.START) {
        dragModeRef.current = "moveStart";
        return;
      }
      if (cell.type === CELL_TYPES.END) {
        dragModeRef.current = "moveEnd";
        return;
      }

      dragModeRef.current = "wall";
      onWallChange(position.row, position.col, true);
    },
    [grid, isAnimating, onWallChange, resolveCellFromEvent]
  );

  const handleMouseOver = useCallback(
    (event) => {
      if (!dragModeRef.current || isAnimating) return;
      const position = resolveCellFromEvent(event);
      if (!position) return;

      switch (dragModeRef.current) {
        case "wall":
          onWallChange(position.row, position.col, true);
          break;
        case "erase":
          onWallChange(position.row, position.col, false);
          break;
        case "moveStart":
          onNodeMove(CELL_TYPES.START, position.row, position.col);
          break;
        case "moveEnd":
          onNodeMove(CELL_TYPES.END, position.row, position.col);
          break;
        default:
          break;
      }
    },
    [isAnimating, onNodeMove, onWallChange, resolveCellFromEvent]
  );

  useEffect(() => {
    const stopDrag = () => {
      dragModeRef.current = null;
    };
    window.addEventListener("mouseup", stopDrag);
    return () => window.removeEventListener("mouseup", stopDrag);
  }, []);

  if (!grid.length) return null;
  const cols = grid[0].length;

  return (
    <div
      role="grid"
      aria-label="Pathfinding grid"
      className="inline-block select-none rounded-lg border border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onContextMenu={(event) => event.preventDefault()}
    >
      {grid.map((row) =>
        row.map((cell) => (
          <div key={`${cell.row}-${cell.col}`} className="aspect-square">
            <Cell cell={cell} />
          </div>
        ))
      )}
    </div>
  );
}
