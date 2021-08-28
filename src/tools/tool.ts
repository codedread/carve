import { CarveMouseEvent } from '../carve-mouse-event.js';
import { EditorHost } from '../editor-host.js';

export interface ToolState {
  /** Whether the tool is active right now. */
  active: boolean;
  /** Whether the tool is enabled right now. */
  enabled: boolean;
}

export const TOOL_STATE_CHANGED_EVENT_TYPE = 'carve-tool-state-changed';

export class ToolStateChangedEvent extends Event {
  constructor(public newState: ToolState) {
    super(TOOL_STATE_CHANGED_EVENT_TYPE);
  }
}

/**
 * Base class for the implementation of a tool (rectangle, etc).
 */
export class Tool extends EventTarget {
  protected state: ToolState = {
    active: false,
    enabled: true,
  };

  constructor(protected host: EditorHost) {
    super();
  }

  // Override these.
  getActions(): string[] { throw `No actions for tool ${this.constructor.name}`; }
  getDescription(): string { return null; }

  isActive(): boolean { return this.state.active; }
  isEnabled(): boolean { return this.state.enabled; }
}

/** A tool that fires one action (like Open File). */
export class SimpleActionTool extends Tool {
  // Override this.
  async onDo() {}
}

/**
 * A tool that lets the user interact with the Document in the work area (like Rectangle).
 * Only one ModeTool will be active at a given time.
 */
export class ModeTool extends Tool {
  // Override these.
  onMouseDown(evt: CarveMouseEvent) {}
  onMouseMove(evt: CarveMouseEvent) {}
  onMouseUp(evt: CarveMouseEvent) {}
  setActive(active: boolean) {
    if (this.state.active !== active) {
      console.log(`Tool '${this.constructor.name}' becoming ${active ? 'active' : 'inactive'}`);
      this.state.active = active;
      this.dispatchEvent(new ToolStateChangedEvent({...this.state}));
    }
  }
}
