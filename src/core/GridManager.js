/**
 * core/GridManager.js
 *
 * Owns every rule about grid shape and cell mutation. This is the
 * "Business Logic" layer from ADR-006: it creates the grid, updates
 * walls, moves the start/end nodes, and resets state. It never imports
 * React and never touches the DOM — components call these functions and
 * store the result in state.
 *
 * Grid shape: grid[row][col], see SRS §8 "Data Model".
 */
import { CELL_TYPES, GRID_ROWS, GRID_COLS } from "../constants/colors.js";

/** Creates a single empty cell following the SRS data model. */
function createCell(row, col, type = CELL_TYPES.EMPTY) {
  return {
    row,
    col,
    type,
    visited: false,
    isPath: false,
    parent: null,
    weight: 1,
    distance: Infinity,
  };
}

/** Default start/end positions: roughly a third in from each edge, vertically centered. */
export function getDefaultNodePositions(rows = GRID_ROWS, cols = GRID_COLS) {
  const midRow = Math.floor(rows / 2);
  return {
    start: { row: midRow, col: Math.floor(cols * 0.15) },
    end: { row: midRow, col: Math.floor(cols * 0.85) },
  };
}

/** Builds a fresh rows x cols grid with the start/end nodes placed. */
export function createGrid(rows = GRID_ROWS, cols = GRID_COLS, positions = null) {
  const { start, end } = positions ?? getDefaultNodePositions(rows, cols);
  const grid = [];

  for (let row = 0; row < rows; row += 1) {
    const rowCells = [];
    for (let col = 0; col < cols; col += 1) {
      let type = CELL_TYPES.EMPTY;
      if (row === start.row && col === start.col) type = CELL_TYPES.START;
      if (row === end.row && col === end.col) type = CELL_TYPES.END;
      rowCells.push(createCell(row, col, type));
    }
    grid.push(rowCells);
  }

  return grid;
}

/** Deep clones the grid so algorithms/animation never mutate React state directly. */
export function cloneGrid(grid) {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

function isInBounds(grid, row, col) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

export function findNodeByType(grid, type) {
  for (const row of grid) {
    for (const cell of row) {
      if (cell.type === type) return cell;
    }
  }
  return null;
}

/**
 * Toggles a wall on/off at (row, col). Refuses to overwrite start/end
 * (FR-2). `forceWall` set to true only draws (never erases) — used while
 * left-dragging; false only erases — used while right-dragging.
 */
export function setWall(grid, row, col, shouldBeWall) {
  if (!isInBounds(grid, row, col)) return grid;
  const cell = grid[row][col];

  if (cell.type === CELL_TYPES.START || cell.type === CELL_TYPES.END) {
    return grid;
  }
  if (shouldBeWall && cell.type === CELL_TYPES.WALL) return grid;
  if (!shouldBeWall && cell.type === CELL_TYPES.EMPTY) return grid;

  const nextGrid = grid.slice();
  const nextRow = nextGrid[row].slice();
  nextRow[col] = {
    ...cell,
    type: shouldBeWall ? CELL_TYPES.WALL : CELL_TYPES.EMPTY,
  };
  nextGrid[row] = nextRow;
  return nextGrid;
}

/**
 * Moves the start or end node to a new position (FR-4). The vacated cell
 * becomes empty; the destination cell can't be a wall or the other node.
 */
export function moveNode(grid, nodeType, row, col) {
  if (!isInBounds(grid, row, col)) return grid;
  const targetCell = grid[row][col];
  if (targetCell.type === CELL_TYPES.WALL) return grid;
  if (
    (nodeType === CELL_TYPES.START && targetCell.type === CELL_TYPES.END) ||
    (nodeType === CELL_TYPES.END && targetCell.type === CELL_TYPES.START)
  ) {
    return grid;
  }
  if (targetCell.type === nodeType) return grid;

  const currentNode = findNodeByType(grid, nodeType);
  const nextGrid = grid.map((r) => r.slice());

  if (currentNode) {
    nextGrid[currentNode.row][currentNode.col] = {
      ...nextGrid[currentNode.row][currentNode.col],
      type: CELL_TYPES.EMPTY,
    };
  }
  nextGrid[row][col] = { ...nextGrid[row][col], type: nodeType };
  return nextGrid;
}

/** Clears visited/path animation flags but keeps walls and node positions (FR-10 "Clear Path"). */
export function clearPath(grid) {
  return grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      visited: false,
      isPath: false,
      parent: null,
      distance: Infinity,
    }))
  );
}

/** Wipes the grid entirely back to defaults (FR-10 "Reset Grid"). */
export function resetGrid(rows = GRID_ROWS, cols = GRID_COLS) {
  return createGrid(rows, cols);
}

/** Replaces the wall layout only (used by maze generation) while keeping start/end. */
export function applyWallMask(grid, wallMask) {
  return grid.map((row, r) =>
    row.map((cell, c) => {
      if (cell.type === CELL_TYPES.START || cell.type === CELL_TYPES.END) {
        return { ...cell, visited: false, isPath: false, parent: null, distance: Infinity };
      }
      return {
        ...cell,
        type: wallMask[r][c] ? CELL_TYPES.WALL : CELL_TYPES.EMPTY,
        visited: false,
        isPath: false,
        parent: null,
        distance: Infinity,
      };
    })
  );
}

/** Marks a single cell as visited (used by AnimationManager's onVisit callback). */
export function markVisited(grid, row, col) {
  if (!isInBounds(grid, row, col)) return grid;
  const nextGrid = grid.slice();
  const nextRow = nextGrid[row].slice();
  nextRow[col] = { ...nextGrid[row][col], visited: true };
  nextGrid[row] = nextRow;
  return nextGrid;
}

/** Marks a single cell as part of the shortest path (used by onPath callback). */
export function markPath(grid, row, col) {
  if (!isInBounds(grid, row, col)) return grid;
  const nextGrid = grid.slice();
  const nextRow = nextGrid[row].slice();
  nextRow[col] = { ...nextGrid[row][col], isPath: true };
  nextGrid[row] = nextRow;
  return nextGrid;
}

/**
 * Builds the grid exactly as it should look at a given point in an
 * algorithm's step trace, by re-applying visited/path markers up to
 * (and including) `stepIndex`. This is what lets the Learning Mode
 * timeline slider jump directly to any step instead of only playing
 * forward sequentially — the grid is always a pure function of
 * (base grid, steps, stepIndex), never accumulated mutation.
 *
 * @param {Array} baseGrid - a clean grid (walls/start/end only, already clearPath()'d)
 * @param {Array} steps - the full `steps` trace returned by an algorithm's run()
 * @param {number} stepIndex - index into `steps` to render up to (inclusive)
 */
export function buildGridForStep(baseGrid, steps, stepIndex) {
  let grid = baseGrid;
  const visitedSeen = new Set();

  for (let i = 0; i <= stepIndex && i < steps.length; i += 1) {
    const step = steps[i];

    if (step.action === "reveal-path" && step.currentNode) {
      grid = markPath(grid, step.currentNode.row, step.currentNode.col);
      continue;
    }

    // Every step that names a currentNode which has been fully processed
    // (dequeue/pop/pop-heap) represents a newly visited node.
    const isVisitEvent = step.action === "dequeue" || step.action === "pop" || step.action === "pop-heap";
    if (isVisitEvent && step.currentNode) {
      const { row, col } = step.currentNode;
      const key = `${row}:${col}`;
      const isStartNode = grid[row]?.[col]?.type === CELL_TYPES.START;
      if (!isStartNode && !visitedSeen.has(key)) {
        visitedSeen.add(key);
        grid = markVisited(grid, row, col);
      }
    }
  }

  return grid;
}

export function getNeighbors(grid, cell) {
  const { row, col } = cell;
  const candidates = [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];
  return candidates
    .filter(([r, c]) => isInBounds(grid, r, c))
    .map(([r, c]) => grid[r][c])
    .filter((neighbor) => neighbor.type !== CELL_TYPES.WALL);
}
