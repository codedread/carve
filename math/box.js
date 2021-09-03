/** A simple box mathematical primitive. */
export class Box {
    x;
    y;
    w;
    h;
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    clone() { return new Box(this.x, this.y, this.w, this.h); }
    equals(o) {
        return (this.x === o.x && this.y === o.y && this.w === o.w && this.h === o.h);
    }
    toString() { return `${this.x} ${this.y} ${this.w} ${this.h}`; }
}
//# sourceMappingURL=box.js.map