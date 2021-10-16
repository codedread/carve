import 'mocha';
import { expect } from 'chai';
import { Matrix } from './matrix.js';
import { Point } from './point.js';

describe('Matrix tests', () => {
  const PRECISION = 0.000001;

  it('equals()', () => {
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = new Matrix(1, 2, 3, 4, 5, 6);
    expect(m1.equals(m1)).is.true;
    expect(m1.equals(m2)).is.true;
    expect(m2.equals(m1)).is.true;

    m2.a = 10;
    expect(m1.equals(m2)).is.false;
    expect(m2.equals(m1)).is.false;
  });

  it('preMultiply()', () => {
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = new Matrix(7, 8, 9, 10, 11, 12);

    const m3 = m1.preMultiply(m2);
    expect(m3.a).equals(7*1 + 9*2);
    expect(m3.b).equals(8*1 + 10*2);
    expect(m3.c).equals(7*3 + 9*4);
    expect(m3.d).equals(8*3 + 10*4);
    expect(m3.e).equals(7*5 + 9*6 + 11);
    expect(m3.f).equals(8*5 + 10*6 + 12);
  });

  it('transformPoint()', () => {
    const m1 = new Matrix(1, 0, 0, 1, 5, 6);

    const p1 = new Point(3, 4);
    const p2 = m1.transformPoint(p1);

    expect(p2.x).equals(3 + 5);
    expect(p2.y).equals(4 + 6);
  });

  it('rotateBy()', () => {
    const m = Matrix.rotateBy(90);
    const pt = m.transformPoint(new Point(2, 2));

    expect(pt.x).is.closeTo(-2, PRECISION);
    expect(pt.y).is.closeTo(2, PRECISION);
  });

  it('rotateBy() around point', () => {
    const m = Matrix.rotateBy(90, new Point(0, 1));
    const pt = m.transformPoint(new Point(0, 2));

    expect(pt.x).is.closeTo(-1, PRECISION);
    expect(pt.y).is.closeTo(1, PRECISION);
  });

  it('scaleBy()', () => {
    const m = Matrix.scaleBy(3, 2);
    const pt = m.transformPoint(new Point(4, 5));

    expect(pt.x).equals(3 * 4);
    expect(pt.y).equals(2 * 5);
  });

  it('translateBy()', () => {
    const m = Matrix.translateBy(new Point(3, 2));
    const pt = m.transformPoint(new Point(4, 5));

    expect(pt.x).equals(3 + 4);
    expect(pt.y).equals(2 + 5);
  });
});
