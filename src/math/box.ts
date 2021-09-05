/** A simple box mathematical primitive. */
export class Box {
  constructor(public x: number = 0, public y: number = 0,
      public w: number = 0, public h: number = 0) {}

  clone(): Box { return new Box(this.x, this.y, this.w, this.h); }

  equals(o: Box): boolean {
    return (this.x === o.x && this.y === o.y && this.w === o.w && this.h === o.h);
  }

  toString(): string { return `${this.x} ${this.y} ${this.w} ${this.h}`; }

  static fromViewBoxString(viewBox: string): Box {
    if (!viewBox) {
      throw `Must send a string to fromViewBox()`;
    }

    const vbArray = viewBox.split(' ');
    if (vbArray.length !== 4) {
      throw `Cannot handle this viewBox: ${viewBox}`;
    }

    const x = Number(vbArray[0]);
    const y = Number(vbArray[1]);
    const w = Number(vbArray[2]);
    const h = Number(vbArray[3]);
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      throw `Invalid viewBox (not numbers): ${viewBox}`;
    }

    return new Box(x, y, w, h);
  }
}
