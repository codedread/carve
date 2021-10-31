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
  async onDo(action: string) {}
}

/**
 * A tool that lets the user interact with the Document in the work area (like Select, Rectangle).
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
      if (!active) {
        this.cleanUp();
      }
      this.dispatchEvent(new ToolStateChangedEvent({...this.state}));
    }
  }
  /**
   * Override this in sub-classes to clean up any state the tool might have. This is called when the
   * tool goes from active to inactive.
   */
  protected cleanUp() {}
}

/**
 * A tool that lets the user draw a shape. It exposes whether the user is in the process of drawing
 * and provides a method to stop the drawing..
 */
export class DrawingTool extends ModeTool {
  private isDrawing: boolean = false;
  getIsDrawing(): boolean { return this.isDrawing; }
  setIsDrawing(d: boolean) { this.isDrawing = d; }
  stopDrawing() { this.cleanUp(); }
  /** @override */
  protected cleanUp() {
    super.cleanUp();
    this.isDrawing = false;
  }
}