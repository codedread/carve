export var Keys;
(function (Keys) {
    Keys["ALT"] = "Alt";
    Keys["CTRL"] = "Control";
    Keys["META"] = "Meta";
    Keys["SHIFT"] = "Shift";
})(Keys || (Keys = {}));
/**
 * Creates a unique string for a given key combination. There must be exactly one non-modifier
 * key included in keys.
 */
export function createKeyStringFromKeys(keys) {
    const nonModifierKeys = [];
    const modifierKeys = [];
    for (const key of keys) {
        if (key === Keys.ALT || key === Keys.CTRL || key === Keys.META || key === Keys.SHIFT) {
            modifierKeys.push(key);
        }
        else {
            nonModifierKeys.push(key);
        }
    }
    // Key combination needs exactly one non-modifier.
    if (nonModifierKeys.length !== 1) {
        return null;
    }
    let str = nonModifierKeys[0];
    if (modifierKeys.length >= 1) {
        modifierKeys.sort();
        str = modifierKeys.join('+') + '+' + str;
    }
    return str;
}
export function createKeyStringFromKeyboardEvent(ke) {
    const keys = [];
    if (ke.shiftKey) {
        keys.push(Keys.SHIFT);
    }
    if (ke.ctrlKey) {
        keys.push(Keys.CTRL);
    }
    if (ke.metaKey) {
        keys.push(Keys.META);
    }
    if (ke.altKey) {
        keys.push(Keys.ALT);
    }
    keys.push(ke.key);
    return createKeyStringFromKeys(keys);
}
export function createKeysFromKeyString(keyString) {
    if (!keyString || keyString.length === 0) {
        throw `Invalid keyString sent to createKeysFromKeyString()`;
    }
    return keyString.split('+');
}
//# sourceMappingURL=key-handler.js.map