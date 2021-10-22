/**
 * An event indicating the drawing style has changed. The event includes copies of the new and old
 * drawing styles.
*/
export class DrawingStyleChangedEvent extends Event {
    newDrawingStyle;
    oldDrawingStyle;
    static TYPE = 'carve-drawing-style-changed';
    constructor(newDrawingStyle, oldDrawingStyle) {
        super(DrawingStyleChangedEvent.TYPE);
        this.newDrawingStyle = newDrawingStyle;
        this.oldDrawingStyle = oldDrawingStyle;
    }
}
export const DEFAULT_DRAWING_STYLE = {
    fill: 'blue',
    stroke: 'black',
};
//# sourceMappingURL=drawing-style.js.map