
export const DRAWING_STYLE_CHANGED_EVENT_TYPE = 'carve-drawing-style-changed';

/** An event indicating the drawing style has changed. */
export class DrawingStyleChangedEvent extends Event {
  constructor(public drawingStyle: DrawingStyle) {
    super(DRAWING_STYLE_CHANGED_EVENT_TYPE);
  }
}

/**
 * An interface that represents the editor's current drawing style.
 */
export interface DrawingStyle {
  /** Can be a RGB(A) value, a CSS color, a URL, etc. */
  fill: string;
}

export const DEFAULT_DRAWING_STYLE: DrawingStyle = {
  fill: 'blue',
};
