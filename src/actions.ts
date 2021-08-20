
/**
 * This is the list of actions that the editor knows about. It is not an enum because eventually
 * the editor will be extensible.
 */
export const CarveAction = {
  OPEN_DOCUMENT: 'open_document',
}

// It is confusing to have a type the same name as the above object, but Typescript allows this.
export type CarveAction = string;
