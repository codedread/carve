/**
 * An event indicating the drawing style has changed. The event includes copies of the new and old
 * drawing styles.
*/
export class DrawingStyleChangedEvent extends Event {
  static TYPE: string = 'carve-drawing-style-changed';
  constructor(public newDrawingStyle: DrawingStyle, public oldDrawingStyle: DrawingStyle) {
    super(DrawingStyleChangedEvent.TYPE);
  }
}

/**
 * An interface that represents the editor's current drawing style. This must be a flat object such
 * that copies can be made with a simple destructure.
 */
export interface DrawingStyle {
  /** Can be a RGB(A) value, a CSS color, a URL, etc. */
  fill: string;

  /** Can be a RGB(A) value, a CSS color, a URL, etc. */
  stroke: string;
}

export const DEFAULT_DRAWING_STYLE: DrawingStyle = {
  fill: 'blue',
  stroke: 'black',
};
