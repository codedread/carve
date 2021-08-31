import { Box } from './math/box.js';
import { Point } from './math/point.js';

export const SELECTION_EVENT_TYPE = 'carve-selection';

const DOCUMENT_POSITION_PRECEDING = 2;
const DOCUMENT_POSITION_FOLLOWING = 4;

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
      const bbox = elem.getBBox();
      const pts = [
        new Point(bbox.x, bbox.y),
        new Point(bbox.x + bbox.width, bbox.y),
        new Point(bbox.x + bbox.width, bbox.y + bbox.height),
        new Point(bbox.x, bbox.y + bbox.height),
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
   * Returns true if the element was present and removed. False otherweise.
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
