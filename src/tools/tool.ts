import { CarveMouseEvent } from '../carve-mouse-event.js';
import { EditorHost } from '../editor-host.js';

/**
 * Base class for the implementation of a tool (rectangle, etc).
 * Only one tool can be active at a given time.
 */
export class Tool {
  constructor(protected host: EditorHost) {}

  onMouseDown(evt: CarveMouseEvent) {}
  onMouseMove(evt: CarveMouseEvent) {}
  onMouseUp(evt: CarveMouseEvent) {}
}
