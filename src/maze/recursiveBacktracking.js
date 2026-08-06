/**
 * maze/recursiveBacktracking.js
 *
 * Randomized Recursive Backtracking maze generation (FR-8 / ADR-009).
 * Produces a boolean "wall mask" (true = wall) the same shape as the
 * grid. It never touches React state directly — GridManager.applyWallMask
 * is responsible for merging the mask into the grid while preserving the
 * start/end nodes.
 *
 * Classic recursive backtracking carves passages between "cells" that
 * live on even row/col indices, knocking down the wall on the odd
 * index between two neighboring cells. This naturally produces
 * single-width corridors, which is why PathPilot's default 25x45 grid
 * uses odd dimensions.
 */

function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a wall mask for a rows x cols grid.
 * @param {number} rows
 * @param {number} cols
 * @param {{row:number, col:number}} startCell - kept clear and reachable
 * @param {{row:number, col:number}} endCell - kept clear and reachable
 * @returns {boolean[][]} wallMask, wallMask[row][col] === true means "wall"
 */
export function generateMaze(rows, cols, startCell, endCell) {
  // Start fully walled, then carve corridors out.
  const wallMask = Array.from({ length: rows }, () => Array(cols).fill(true));

  const isValidCell = (row, col) => row > 0 && row < rows - 1 && col > 0 && col < cols - 1;

  // Snap the carve origin to an even coordinate so the corridor lattice
  // stays consistent, then run an iterative (stack-based) DFS carve.
  const originRow = startCell.row % 2 === 0 ? startCell.row : startCell.row + 1;
  const originCol = startCell.col % 2 === 0 ? startCell.col : startCell.col + 1;
  const origin = {
    row: Math.min(Math.max(originRow, 1), rows - 2),
    col: Math.min(Math.max(originCol, 1), cols - 2),
  };

  wallMask[origin.row][origin.col] = false;
  const stack = [origin];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const directions = shuffle([
      { dr: -2, dc: 0 },
      { dr: 2, dc: 0 },
      { dr: 0, dc: -2 },
      { dr: 0, dc: 2 },
    ]);

    let carved = false;

    for (const { dr, dc } of directions) {
      const nextRow = current.row + dr;
      const nextCol = current.col + dc;

      if (isValidCell(nextRow, nextCol) && wallMask[nextRow][nextCol]) {
        // Knock down the wall between current and next.
        wallMask[current.row + dr / 2][current.col + dc / 2] = false;
        wallMask[nextRow][nextCol] = false;
        stack.push({ row: nextRow, col: nextCol });
        carved = true;
        break;
      }
    }

    if (!carved) stack.pop();
  }

  // Guarantee the start and end nodes (and their immediate cell) are open,
  // regardless of parity, so the visualizer never opens onto a walled node.
  clearAround(wallMask, startCell, rows, cols);
  clearAround(wallMask, endCell, rows, cols);

  return wallMask;
}

function clearAround(wallMask, cell, rows, cols) {
  wallMask[cell.row][cell.col] = false;
  const neighbors = [
    [cell.row - 1, cell.col],
    [cell.row + 1, cell.col],
    [cell.row, cell.col - 1],
    [cell.row, cell.col + 1],
  ];
  for (const [r, c] of neighbors) {
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      wallMask[r][c] = false;
    }
  }
}

export default { generateMaze };
