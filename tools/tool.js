export class ToolStateChangedEvent extends Event {
    newState;
    static TYPE = 'carve-tool-state-changed';
    constructor(newState) {
        super(ToolStateChangedEvent.TYPE);
        this.newState = newState;
    }
}
/**
 * Base class for the implementation of a tool (rectangle, etc). A tool is a piece of functionality
 * that lets the user change either change the current document or change the editor state.
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
    getHost() { return this.host; }
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
    async onDo(action) { }
}
/**
 * A tool that lets the user interact with the Document in the work area (like Select, Rectangle).
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
            if (!active) {
                this.cleanUp();
            }
            this.dispatchEvent(new ToolStateChangedEvent({ ...this.state }));
        }
    }
    /**
     * Override this in sub-classes to clean up any state the tool might have. This is called when the
     * tool goes from active to inactive.
     */
    cleanUp() { }
}
/**
 * A tool that lets the user draw a shape. It exposes whether the user is in the process of drawing
 * and provides a method to stop the drawing..
 */
export class DrawingTool extends ModeTool {
    isDrawing = false;
    getIsDrawing() { return this.isDrawing; }
    setIsDrawing(d) { this.isDrawing = d; }
    stopDrawing() { this.cleanUp(); }
    /** @override */
    cleanUp() {
        super.cleanUp();
        this.isDrawing = false;
    }
}
//# sourceMappingURL=tool.js.map