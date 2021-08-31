/** A simple box mathematical primitive. */
export class Box {
  constructor(public x: number = 0, public y: number = 0,
      public w: number = 0, public h: number = 0) {}

  clone(): Box { return new Box(this.x, this.y, this.w, this.h); }

  equals(o: Box): boolean {
    return (this.x === o.x && this.y === o.y && this.w === o.w && this.h === o.h);
  }

  toString(): string { return `${this.x} ${this.y} ${this.w} ${this.h}`; }
}
