
export enum Keys {
  ALT = 'Alt',
  CONTROL = 'Control',
  META = 'Meta',
  SHIFT = 'Shift',
}

/**
 * Creates a unique string for a given key combination. There must be at least one non-modifier
 * key included in keys.
 */
export function createKeyStringFromKeys(keys: string[]): string {
  const nonModifierKeys = []
  const modifierKeys = [];
  for (const key of keys) {
    if (key === Keys.ALT || key === Keys.CONTROL || key === Keys.META || key === Keys.SHIFT) {
      modifierKeys.push(key);
    } else {
      nonModifierKeys.push(key);
    }
  }

  if (nonModifierKeys.length < 1) {
    throw `Error: Key combination needs one non-modifier: ${keys.join('+')}`;
  }
  nonModifierKeys.sort();
  let str = nonModifierKeys.join('+');

  if (modifierKeys.length >= 1) {
    modifierKeys.sort();
    str = modifierKeys.join('+') + '+' + str;
  }
  return str;
}

export function createKeysFromKeyString(keyString: string): string[] {
  if (!keyString || keyString.length === 0) {
    throw `Invalid keyString sent to createKeysFromKeyString()`;
  }
  return keyString.split('+');
}
