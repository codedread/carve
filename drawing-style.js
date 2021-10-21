export const DRAWING_STYLE_CHANGED_EVENT_TYPE = 'carve-drawing-style-changed';
/** An event indicating the drawing style has changed. */
export class DrawingStyleChangedEvent extends Event {
    drawingStyle;
    constructor(drawingStyle) {
        super(DRAWING_STYLE_CHANGED_EVENT_TYPE);
        this.drawingStyle = drawingStyle;
    }
}
export const DEFAULT_DRAWING_STYLE = {
    fill: 'blue',
};
//# sourceMappingURL=drawing-style.js.map