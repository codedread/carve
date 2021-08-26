import { CarveMouseEvent } from '../carve-mouse-event.js';
import { EditorHost } from '../editor-host.js';

/**
 * Base class for the implementation of a tool (rectangle, etc).
 * Only one tool can be active at a given time.
 */
export class Tool {
  constructor(protected host: EditorHost) {}

  // Override these.
  getActions(): string[] { throw `No actions for tool ${this.constructor.name}`; }
  getDescription(): string { return null; }
}

/** A tool that fires one action (like Open File). */
export class SimpleActionTool extends Tool {
  // Override this.
  async onDo() {}
}

/** A tool that lets the user interact with the Document in the work area (like Rectangle). */
export class ModeTool extends Tool {
  // Override these.
  onMouseDown(evt: CarveMouseEvent) {}
  onMouseMove(evt: CarveMouseEvent) {}
  onMouseUp(evt: CarveMouseEvent) {}
  setActive(active: boolean) {}
}
