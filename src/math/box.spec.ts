import 'mocha';
import { assert, expect } from 'chai';
import { Box } from './box.js';

describe('Box tests', () => {
  describe('fromViewBox()', () => {
    it('parses integers', () => {
      const box = Box.fromViewBoxString('-30 10 200 100');
      expect(box.x).equals(-30);
      expect(box.y).equals(10);
      expect(box.w).equals(200);
      expect(box.h).equals(100);
    });

    it('parses floats', () => {
      const box = Box.fromViewBoxString('10.5 -20.4 200.6 100.9');
      expect(box.x).equals(10.5);
      expect(box.y).equals(-20.4);
      expect(box.w).equals(200.6);
      expect(box.h).equals(100.9);
    });

    it('throws error if null arg', () => {
      expect(() => Box.fromViewBoxString(null)).to.throw();
    });

    it('throws error if empty string arg', () => {
      expect(() => Box.fromViewBoxString('')).to.throw();
    });

    it('throws error if not four space-separated strings', () => {
      expect(() => Box.fromViewBoxString('0 1 2')).to.throw();
    });

    it('throws error if not values not parseable', () => {
      expect(() => Box.fromViewBoxString('0 1 -a b')).to.throw();
    });
  });
});
