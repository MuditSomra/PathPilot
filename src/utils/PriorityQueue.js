/**
 * utils/PriorityQueue.js
 *
 * Binary min-heap keyed by a numeric priority (A* uses fScore).
 * O(log n) push/pop keeps A* efficient on large grids.
 */
export default class PriorityQueue {
  constructor() {
    this._heap = [];
  }

  get size() {
    return this._heap.length;
  }

  isEmpty() {
    return this._heap.length === 0;
  }

  /**
   * Returns a priority-sorted snapshot of {item, priority} entries
   * without mutating the heap. The internal array is only a valid heap,
   * not a sorted list, so this clones and sorts a shallow copy. Used by
   * Learning Mode to render the live Priority Queue — never called from
   * A*'s hot loop.
   */
  toSortedArray() {
    return this._heap
      .slice()
      .sort((a, b) => a.priority - b.priority)
      .map((entry) => ({ item: entry.item, priority: entry.priority }));
  }

  push(item, priority) {
    this._heap.push({ item, priority });
    this._bubbleUp(this._heap.length - 1);
  }

  pop() {
    if (this.isEmpty()) return undefined;
    const top = this._heap[0];
    const last = this._heap.pop();

    if (this._heap.length > 0) {
      this._heap[0] = last;
      this._bubbleDown(0);
    }

    return top.item;
  }

  _bubbleUp(index) {
    let i = index;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this._heap[parent].priority <= this._heap[i].priority) break;
      [this._heap[parent], this._heap[i]] = [this._heap[i], this._heap[parent]];
      i = parent;
    }
  }

  _bubbleDown(index) {
    let i = index;
    const length = this._heap.length;
    let hasSwapped = true;

    while (hasSwapped) {
      const left = i * 2 + 1;
      const right = i * 2 + 2;
      let smallest = i;

      if (left < length && this._heap[left].priority < this._heap[smallest].priority) {
        smallest = left;
      }
      if (right < length && this._heap[right].priority < this._heap[smallest].priority) {
        smallest = right;
      }

      hasSwapped = smallest !== i;
      if (hasSwapped) {
        [this._heap[i], this._heap[smallest]] = [this._heap[smallest], this._heap[i]];
        i = smallest;
      }
    }
  }
}
