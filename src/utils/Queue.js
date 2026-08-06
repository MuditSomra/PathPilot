/**
 * utils/Queue.js
 *
 * A minimal, dependency-free FIFO queue. Uses a head pointer instead of
 * Array.shift() so dequeue stays O(1) even on the ~1000+ node grids this
 * app operates on (Array.shift() is O(n) and would visibly slow BFS down).
 */
export default class Queue {
  constructor() {
    this._items = [];
    this._head = 0;
  }

  enqueue(item) {
    this._items.push(item);
  }

  dequeue() {
    if (this.isEmpty()) return undefined;
    const item = this._items[this._head];
    this._head += 1;

    // Reclaim memory once the consumed prefix gets large.
    if (this._head > 1000 && this._head * 2 > this._items.length) {
      this._items = this._items.slice(this._head);
      this._head = 0;
    }

    return item;
  }

  isEmpty() {
    return this._head >= this._items.length;
  }

  get size() {
    return this._items.length - this._head;
  }

  /**
   * Returns a snapshot array of the queue's current contents, front to
   * back, without mutating internal state. Used by Learning Mode to
   * render the live Queue visualization — never called from the hot
   * BFS loop, so it doesn't affect algorithm performance.
   */
  toArray() {
    return this._items.slice(this._head);
  }
}
