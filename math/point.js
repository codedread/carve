/** A 2D point. */
export class Point {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `{x: ${this.x}, y: ${this.y}}`;
    }
    /** Reflects this Point across the x-y axis and returns a new Point. */
    reflectXY() {
        return new Point(-this.x, -this.y);
    }
}
//# sourceMappingURL=point.js.map