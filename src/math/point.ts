/** A 2D point. */
export class Point {
  constructor(public x: number = 0, public y: number = 0) {}

  toString(): string {
    return `{x: ${this.x}, y: ${this.y}}`;
  }

  /** Reflects this Point across the x-y axis and returns a new Point. */
  reflectXY(): Point {
    return new Point(-this.x, -this.y);
  }
}
