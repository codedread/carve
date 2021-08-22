import { CarveAction } from './actions.js';

/** Maps keys to actions. */
export function keyToAction(key: string): CarveAction {
  switch (key) {
    // Document actions.
    case 'n': return CarveAction.NEW_DOCUMENT;
    case 'o': return CarveAction.OPEN_DOCUMENT;
    // Drawing modes.
    case 'r': return CarveAction.RECTANGLE_MODE;
  }

  return null;
}
