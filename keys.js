import { CarveAction } from './actions.js';
/** Maps keys to actions. */
export function keyToAction(key) {
    switch (key) {
        case 'e': return CarveAction.ELLIPSE_MODE;
    }
    return null;
}
//# sourceMappingURL=keys.js.map