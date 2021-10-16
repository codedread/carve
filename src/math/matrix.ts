import { Point } from './point.js';

const RAD2DEG = 180 / Math.PI;

// TODO: Write some unit tests.

/** Given a matrix, determines the angle of rotation, in degrees. */
export function getRotationDegrees(matrix) {
  // This math is taken from:
  // https://stackoverflow.com/questions/16359246/how-to-extract-position-rotation-and-scale-from-matrix-svg
  let {a, b, c, d} = matrix;

  const scaleX = Math.sqrt(a * a + b * b);
  if (scaleX) {
    a /= scaleX;
    b /= scaleX;
  }

  const skewX = a * c + b * d;
  if (skewX) {
    c -= a * skewX;
    d -= b * skewX;
  }

  const scaleY = Math.sqrt(c * c + d * d);
  if (scaleY) {
    c /= scaleY;
    d /= scaleY;
  }

  if (a * d < b * c) {
    a = -a;
    b = -b;
  }

  return Math.atan2(b, a) * RAD2DEG;  
}

/**
 * a c e
 * b d f
 * 0 0 1
 */
export class Matrix {
  constructor(public a: number, public b: number, public c: number, public d: number,
             public e: number, public f: number) {}

  equals(that: Matrix): boolean {
    return this.a === that.a &&
        this.b === that.b &&
        this.c === that.c &&
        this.d === that.d &&
        this.e === that.e &&
        this.f === that.f;
  }

  /**
   * Multiplies this matrix by that matrix and returns a new Matrix.
   */
  preMultiply(that: Matrix): Matrix {
    const m1 = that;
    const m2 = this;
    return new Matrix(
        (m1.a * m2.a) + (m1.c * m2.b),
        (m1.b * m2.a) + (m1.d * m2.b),
        (m1.a * m2.c) + (m1.c * m2.d),
        (m1.b * m2.c) + (m1.d * m2.d),
        (m1.a * m2.e) + (m1.c * m2.f) + m1.e,
        (m1.b * m2.e) + (m1.d * m2.f) + m1.f);
  }

  toString(): string {
    return `{a: ${this.a}, b: ${this.b}, c: ${this.c}, d: ${this.d}, e: ${this.e}, f: ${this.f}}`;
  }

  private toTransformString(): string {
    const arr = [this.a, this.b, this.c, this.d, this.e, this.f];
    return 'matrix(' + arr.join(',') + ')';
  }

  /**
   * Multiplies this matrix by a point and returns a new Point.
   */
  transformPoint(pt: Point): Point {
    return new Point(
      this.a * pt.x + this.c * pt.y + this.e,
      this.b * pt.x + this.d * pt.y + this.f);
  }

  static identity(): Matrix {
    return new Matrix(1, 0, 0, 1, 0, 0);
  }

  static fromSvgMatrix(svgMatrix: SVGMatrix): Matrix {
    return new Matrix(svgMatrix.a, svgMatrix.b, svgMatrix.c, svgMatrix.d, svgMatrix.e, svgMatrix.f);
  }

  /**
   * @param angle in degrees.
   * @param center The center of rotation.
   */
   static rotateBy(angle: number, center: Point = null): Matrix {
    if (center) {
      return Matrix.translateBy(center.reflectXY())
          .preMultiply(Matrix.rotateBy(angle))
          .preMultiply(Matrix.translateBy(center));
    }
    const a = angle * Math.PI / 180;
    return new Matrix(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0);
  }

  static scaleBy(sx: number, sy: number): Matrix {
    return new Matrix(sx, 0, 0, sy, 0, 0);
  }

  /**
   * @param {Point} dist The distance to translate, as a point.
   */
  static translateBy(dist: Point): Matrix {
    return new Matrix(1, 0, 0, 1, dist.x, dist.y);
  }
}