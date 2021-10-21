import { CarveMouseEvent } from '../carve-mouse-event.js';
import { EditorHost } from '../editor-host.js';

export interface ToolState {
  /** Whether the tool is active right now (i.e. the currently active tool). */
  active: boolean;
  /** Whether the tool is disabled right now (i.e. not able to be activated/used). */
  disabled: boolean;
}

export class ToolStateChangedEvent extends Event {
  static TYPE: string = 'carve-tool-state-changed';
  constructor(public newState: ToolState) {
    super(ToolStateChangedEvent.TYPE);
  }
}

/**
 * Base class for the implementation of a tool (rectangle, etc). A tool is a piece of functionality
 * that lets the user change either change the current document or change the editor state.
 */
export class Tool extends EventTarget {
  protected state: ToolState;

  constructor(protected host: EditorHost, state: ToolState = {
    active: false,
    disabled: false,
  }) {
    super();
    this.state = {...state};
  }

  // Override these.
  getActions(): string[] { throw `No actions for tool ${this.constructor.name}`; }
  getDescription(): string { return null; }
  getHost(): EditorHost { return this.host; }
  getState(): ToolState { return {...this.state}; }

  isActive(): boolean { return this.state.active; }
  isDisabled(): boolean { return this.state.disabled; }

  setDisabled(disabled: boolean) {
    if (this.state.disabled !== disabled) {
      console.log(`Tool '${this.constructor.name}' is becoming ${disabled ? 'disabled' : 'enabled'}`);
      this.state.disabled = disabled;
      this.dispatchEvent(new ToolStateChangedEvent({...this.state}));
    }
  }
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
      console.log(`Tool '${this.constructor.name}' is becoming ${active ? 'active' : 'inactive'}`);
      this.state.active = active;
      this.dispatchEvent(new ToolStateChangedEvent({...this.state}));
    }
  }
}
