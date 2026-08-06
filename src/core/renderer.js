/**
 * core/renderer.js
 *
 * The final layer in the architecture chain (React Components -> Grid
 * Manager -> Algorithms -> Animation Engine -> Renderer, SRS §7). It
 * translates a cell's plain-data state into a Tailwind className. The
 * Cell component calls this instead of embedding style decisions
 * itself, keeping Cell purely presentational.
 */
import { CELL_TYPES, CELL_STYLES } from "../constants/colors.js";

export function getCellClassName(cell) {
  const classes = [CELL_STYLES.base];

  switch (cell.type) {
    case CELL_TYPES.START:
      classes.push(CELL_STYLES.start);
      break;
    case CELL_TYPES.END:
      classes.push(CELL_STYLES.end);
      break;
    case CELL_TYPES.WALL:
      classes.push(CELL_STYLES.wall);
      break;
    default:
      if (cell.isPath) {
        classes.push(CELL_STYLES.path);
      } else if (cell.visited) {
        classes.push(CELL_STYLES.visited);
      } else {
        classes.push(CELL_STYLES.empty);
      }
  }

  return classes.join(" ");
}

export default { getCellClassName };
