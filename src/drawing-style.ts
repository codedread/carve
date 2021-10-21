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
