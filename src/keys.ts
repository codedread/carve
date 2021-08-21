import { CarveAction } from './actions.js';

/** Maps keys to actions. */
export function keyToAction(key: string): CarveAction {
  switch (key) {
    case 'n': return CarveAction.NEW_DOCUMENT;
    case 'o': return CarveAction.OPEN_DOCUMENT;
  }

  return null;
}
