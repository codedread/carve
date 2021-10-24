import 'mocha';
import { expect } from 'chai';

import { createKeysFromKeyString, createKeyStringFromKeyboardEvent, createKeyStringFromKeys } from './key-handler.js';

describe('KeyHandler tests', () => {
  describe('createKeyStringFromKeys() tests', () => {
    it('createKeyStringFromKeys() produces a sorted key string', () => {
      expect(createKeyStringFromKeys(['z'])).equals('z');
    });

    it('createKeyStringFromKeys() with a modifier produces a sorted key string', () => {
      const expected = 'Alt+Shift+z';
      expect(createKeyStringFromKeys(['Shift', 'Alt', 'z'])).equals(expected);
      expect(createKeyStringFromKeys(['z', 'Alt', 'Shift'])).equals(expected);
    });

    it('createKeyStringFromKeys() must have exactly one non-modifier', () => {
      expect(createKeyStringFromKeys(['Alt', 'Meta'])).equals(null);
      expect(createKeyStringFromKeys(['a', 'z'])).equals(null);
    });
  });

  describe('createKeyStringFromKeyboardEvent() tests', () => {
    it('createKeyStringFromKeyboardEvent() produces a sorted key string', () => {
      expect(createKeyStringFromKeyboardEvent({key: 'c'} as KeyboardEvent)).equals('c');
    });

    it('createKeyStringFromKeyboardEvent() with modifiers produces a sorted key string', () => {
      const fakeKeyboardEvent = {
        altKey: true,
        ctrlKey: true,
        metaKey: true,
        shiftKey: true,
        key: 'z',
      };
      expect(createKeyStringFromKeyboardEvent(fakeKeyboardEvent as KeyboardEvent))
          .equals('Alt+Control+Meta+Shift+z');
    });
  });

  describe('createKeysFromKeyString() tests', () => {
    it('createKeysFromKeyString() produces a keys array', () => {
      expect(createKeysFromKeyString('a+z')).to.have.members(['a', 'z']).and.length(2);
    });
    it('createKeysFromKeyString() with modifiers produces a keys array', () => {
      expect(createKeysFromKeyString('Alt+Shift+z'))
          .to.have.members(['z', 'Alt', 'Shift']).and.length(3);
    });
  })
});
