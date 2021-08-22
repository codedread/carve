/**
 * Base class for the implementation of a tool (rectangle, etc).
 * Only one tool can be active at a given time.
 */
export class Tool {
    constructor(host) {
        this.host = host;
    }
    onMouseDown(evt) { }
    onMouseMove(evt) { }
    onMouseUp(evt) { }
}
//# sourceMappingURL=tool.js.map