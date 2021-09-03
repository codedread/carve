export const TOOL_STATE_CHANGED_EVENT_TYPE = 'carve-tool-state-changed';
export class ToolStateChangedEvent extends Event {
    newState;
    constructor(newState) {
        super(TOOL_STATE_CHANGED_EVENT_TYPE);
        this.newState = newState;
    }
}
/**
 * Base class for the implementation of a tool (rectangle, etc).
 */
export class Tool extends EventTarget {
    host;
    state;
    constructor(host, state = {
        active: false,
        disabled: false,
    }) {
        super();
        this.host = host;
        this.state = { ...state };
    }
    // Override these.
    getActions() { throw `No actions for tool ${this.constructor.name}`; }
    getDescription() { return null; }
    getState() { return { ...this.state }; }
    isActive() { return this.state.active; }
    isDisabled() { return this.state.disabled; }
    setDisabled(disabled) {
        if (this.state.disabled !== disabled) {
            console.log(`Tool '${this.constructor.name}' is becoming ${disabled ? 'disabled' : 'enabled'}`);
            this.state.disabled = disabled;
            this.dispatchEvent(new ToolStateChangedEvent({ ...this.state }));
        }
    }
}
/** A tool that fires one action (like Open File). */
export class SimpleActionTool extends Tool {
    // Override this.
    async onDo() { }
}
/**
 * A tool that lets the user interact with the Document in the work area (like Rectangle).
 * Only one ModeTool will be active at a given time.
 */
export class ModeTool extends Tool {
    // Override these.
    onMouseDown(evt) { }
    onMouseMove(evt) { }
    onMouseUp(evt) { }
    setActive(active) {
        if (this.state.active !== active) {
            console.log(`Tool '${this.constructor.name}' is becoming ${active ? 'active' : 'inactive'}`);
            this.state.active = active;
            this.dispatchEvent(new ToolStateChangedEvent({ ...this.state }));
        }
    }
}
//# sourceMappingURL=tool.js.map