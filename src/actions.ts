
/**
 * This is the list of actions that the editor knows about. It is not an enum because we might
 * later make the editor extensible.
 */
export const CarveAction = {
  // Document Actions.

  /** The user has indicated a new document is to be created. */
  NEW_DOCUMENT: 'new_document',
  /** The user has indicated a document should be loaded from the file system. */
  OPEN_DOCUMENT: 'open_document',

  // Drawing Actions.
  RECTANGLE_MODE: 'rectangle_mode',
  ELLIPSE_MODE: 'ellipse_mode',
}

// It is confusing to have a type the same name as the above object, but Typescript allows this.
export type CarveAction = string;
