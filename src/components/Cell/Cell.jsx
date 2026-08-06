import React from "react";
import { getCellClassName } from "../../core/renderer.js";

/**
 * Cell — renders exactly one grid square. It holds no business logic:
 * it doesn't know what a wall "means", how BFS works, or how to move
 * itself. Pointer events are handled by the parent Grid via event
 * delegation, which is why this component carries no onMouse* props of
 * its own — only the data-row/data-col attributes the delegator reads.
 */
function Cell({ cell }) {
  return (
    <div
      data-row={cell.row}
      data-col={cell.col}
      role="gridcell"
      aria-label={`Row ${cell.row + 1}, Column ${cell.col + 1}, ${cell.type}`}
      className={getCellClassName(cell)}
    />
  );
}

function areEqual(prevProps, nextProps) {
  const a = prevProps.cell;
  const b = nextProps.cell;
  return (
    a.type === b.type &&
    a.visited === b.visited &&
    a.isPath === b.isPath
  );
}

export default React.memo(Cell, areEqual);
