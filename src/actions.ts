
/**
 * TODO: DEPRECATE.
 * This is the list of actions that the editor knows about. It is not an enum because we might
 * later make the editor extensible.
 */
export const CarveAction = {
  // Drawing Actions.
  RECTANGLE_MODE: 'rectangle_mode',
  ELLIPSE_MODE: 'ellipse_mode',
}

// It is confusing to have a type the same name as the above object, but Typescript allows this.
export type CarveAction = string;
