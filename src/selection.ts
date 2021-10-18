import { Box } from './math/box.js';
import { Point } from './math/point.js';
import { DOCUMENT_POSITION_FOLLOWING, DOCUMENT_POSITION_PRECEDING } from './constants.js';

export const SELECTION_EVENT_TYPE = 'carve-selection';

/** An event indicating some selection has changed. */
export class SelectionEvent extends Event {
  constructor(public selectedElements: Element[]) {
    super(SELECTION_EVENT_TYPE);
  }
}

/** A stateful class representing a selection of graphical elements in the drawing. */
export class Selection extends EventTarget {
  private selectedElements: SVGGraphicsElement[] = [];

  // Getters.

  elements(): SVGGraphicsElement[] { return this.selectedElements.slice(); }
  has(elem: SVGGraphicsElement) { return this.selectedElements.includes(elem); }
  isEmpty(): boolean { return this.selectedElements.length === 0; }
  isNonEmpty(): boolean { return this.selectedElements.length > 0; }
  size(): number { return this.selectedElements.length; }

  /** Gets the bounding box of the selected elements. Returns null for an empty selection. */
  getBBox() : Box {
    if (this.isEmpty()) {
      return null;
    }

    const topLeft = new Point(Infinity, Infinity);
    const bottomRight = new Point(-Infinity, -Infinity);

    for (const elem of this.elements()) {
      // {stroke: true} might be supported one day
      const bbox = elem.getBBox();
      // Number(null) or Number('') returns 0. This should always be a number.
      const strokeWidth = Number(elem.getAttribute('stroke-width'));
      // Account for half the stroke width in the bounding box.
      const pts = [
        new Point(bbox.x - strokeWidth/2, bbox.y - strokeWidth/2),
        new Point(bbox.x + bbox.width + strokeWidth/2, bbox.y - strokeWidth/2),
        new Point(bbox.x + bbox.width + strokeWidth/2, bbox.y + bbox.height + strokeWidth/2),
        new Point(bbox.x - strokeWidth/2, bbox.y + bbox.height + strokeWidth/2),
      ];
      for (const pt of pts) {
        if (pt.x < topLeft.x) topLeft.x = pt.x;
        if (pt.y < topLeft.y) topLeft.y = pt.y;
        if (pt.x > bottomRight.x) bottomRight.x = pt.x;
        if (pt.y > bottomRight.y) bottomRight.y = pt.y;
      }
    }
    return new Box(topLeft.x, topLeft.y, (bottomRight.x - topLeft.x), (bottomRight.y - topLeft.y));    
  }

  // Mutators.

  /** Adds the given element to the selection. */
  add(elem: SVGGraphicsElement) {
    this.selectedElements.push(elem);
    this.sortIntoDomOrder();
    this.dispatchEvent(new SelectionEvent(this.selectedElements));
  }

  /** Removes all elements from the selection. */
  clear() {
    const shouldSendEvent = this.isNonEmpty();
    this.selectedElements = [];
    if (shouldSendEvent) {
      this.dispatchEvent(new SelectionEvent([]));
    }
  }

  /**
   * Removes the given element from the selection.
   * Returns true if the element was present and removed. False otherwise.
   */
  remove(elem: SVGGraphicsElement): boolean {
    const removeIndex = this.selectedElements.indexOf(elem);
    if (removeIndex !== -1) {
      this.selectedElements.splice(removeIndex, 1);
      this.sortIntoDomOrder();
      this.dispatchEvent(new SelectionEvent(this.selectedElements));
      return true;
    }
    return false;
  }

  /** Sets the selection to the given element. */
  set(elems: SVGGraphicsElement[]) {
    this.selectedElements = [];
    for (const elem of elems) {
      this.selectedElements.push(elem);
    }
    this.sortIntoDomOrder();
    this.dispatchEvent(new SelectionEvent(this.selectedElements));
  }

  private sortIntoDomOrder() {
    this.selectedElements.sort((a, b) => {
      const order = a.compareDocumentPosition(b);
      if (order & DOCUMENT_POSITION_PRECEDING) {
        return 1;
      } else if (order & DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      }
      return 0;
    });
  }
}
