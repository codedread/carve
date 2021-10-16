import 'mocha';
import { expect } from 'chai';
import { Point } from './point.js';

describe('Point tests', () => {
  it('reflectXY()', () => {
    const pt = new Point(4, -5).reflectXY();

    expect(pt.x).equals(-4);
    expect(pt.y).equals(5);
  });
});
