import { CarveAction } from './actions.js';
/** Maps keys to actions. */
export function keyToAction(key) {
    switch (key) {
        // Document actions.
        case 'n': return CarveAction.NEW_DOCUMENT;
        case 'o': return CarveAction.OPEN_DOCUMENT;
        // Drawing modes.
        case 'r': return CarveAction.RECTANGLE_MODE;
        case 'e': return CarveAction.ELLIPSE_MODE;
    }
    return null;
}
//# sourceMappingURL=keys.js.map