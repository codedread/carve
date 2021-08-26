import { CarveAction } from './actions.js';

/** Maps keys to actions. */
export function keyToAction(key: string): CarveAction {
  switch (key) {
    // Drawing modes.
    case 'r': return CarveAction.RECTANGLE_MODE;
    case 'e': return CarveAction.ELLIPSE_MODE;
  }

  return null;
}
