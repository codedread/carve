/** A simple box mathematical primitive. */
export class Box {
  constructor(public x: number = 0, public y: number = 0,
      public w: number = 0, public h: number = 0) {}

  toString(): string {
    return `${this.x} ${this.y} ${this.w} ${this.h}`;
  }
}
