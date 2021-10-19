import { Point } from './point.js';
const RAD2DEG = 180 / Math.PI;
// TODO: Write some unit tests.
/** Given a matrix, determines the angle of rotation, in degrees. */
export function decomposeMatrix(matrix) {
    // This math is taken from:
    // https://stackoverflow.com/questions/16359246/how-to-extract-position-rotation-and-scale-from-matrix-svg
    let { a, b, c, d, e, f } = matrix;
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
    return {
        translateX: e,
        translateY: f,
        scaleX,
        scaleY,
        rotateDegrees: Math.atan2(b, a) * RAD2DEG,
    };
}
// TODO: Put in some precision so that 0.999999,0.999999 resolves to 1,1.
/**
 * a c e
 * b d f
 * 0 0 1
 */
export class Matrix {
    a;
    b;
    c;
    d;
    e;
    f;
    static IDENTITY = null;
    constructor(a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }
    clone() {
        return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
    }
    equals(that) {
        return this.a === that.a &&
            this.b === that.b &&
            this.c === that.c &&
            this.d === that.d &&
            this.e === that.e &&
            this.f === that.f;
    }
    isIdentity() { return this.equals(Matrix.identity()); }
    /**
     * Multiplies this matrix by that matrix and returns a new Matrix.
     */
    preMultiply(that) {
        const m1 = that;
        const m2 = this;
        return new Matrix((m1.a * m2.a) + (m1.c * m2.b), (m1.b * m2.a) + (m1.d * m2.b), (m1.a * m2.c) + (m1.c * m2.d), (m1.b * m2.c) + (m1.d * m2.d), (m1.a * m2.e) + (m1.c * m2.f) + m1.e, (m1.b * m2.e) + (m1.d * m2.f) + m1.f);
    }
    toString() {
        return `{a: ${this.a}, b: ${this.b}, c: ${this.c}, d: ${this.d}, e: ${this.e}, f: ${this.f}}`;
    }
    toTransformString() {
        return `matrix(${[this.a, this.b, this.c, this.d, this.e, this.f].join(',')})`;
    }
    /**
     * Multiplies this matrix by a point and returns a new Point.
     */
    transformPoint(pt) {
        return new Point(this.a * pt.x + this.c * pt.y + this.e, this.b * pt.x + this.d * pt.y + this.f);
    }
    static identity() {
        if (!Matrix.IDENTITY) {
            Matrix.IDENTITY = new Matrix(1, 0, 0, 1, 0, 0);
        }
        return Matrix.IDENTITY;
    }
    static fromSvgMatrix(svgMatrix) {
        return new Matrix(svgMatrix.a, svgMatrix.b, svgMatrix.c, svgMatrix.d, svgMatrix.e, svgMatrix.f);
    }
    /**
     * @param angle in degrees.
     * @param center The center of rotation.
     */
    static rotateBy(angle, center = null) {
        if (center) {
            return Matrix.translateBy(center.reflectXY())
                .preMultiply(Matrix.rotateBy(angle))
                .preMultiply(Matrix.translateBy(center));
        }
        const a = angle * Math.PI / 180;
        return new Matrix(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0);
    }
    static scaleBy(sx, sy) {
        return new Matrix(sx, 0, 0, sy, 0, 0);
    }
    /**
     * @param {Point} delta The vector to translate, as a point.
     */
    static translateBy(delta) {
        return new Matrix(1, 0, 0, 1, delta.x, delta.y);
    }
}
//# sourceMappingURL=matrix.js.map