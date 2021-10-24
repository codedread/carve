import 'mocha';
import { expect } from 'chai';

import { createKeysFromKeyString, createKeyStringFromKeys } from './key-handler.js';

describe('KeyHandler tests', () => {
  describe('createKeyStringFromKeys() tests', () => {
    it('createKeyStringFromKeys() produces a sorted key string', () => {
      expect(createKeyStringFromKeys(['z', 'a'])).equals('a+z');
    });

    it('createKeyStringFromKeys() with a modifier produces a sorted key string', () => {
      const expected = 'Alt+Shift+z';
      expect(createKeyStringFromKeys(['Shift', 'Alt', 'z'])).equals(expected);
      expect(createKeyStringFromKeys(['z', 'Alt', 'Shift'])).equals(expected);
    });

    it('createKeyStringFromKeys() must have at least one non-modifier', () => {
      expect(() => createKeyStringFromKeys(['Alt', 'Meta'])).throws();
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
