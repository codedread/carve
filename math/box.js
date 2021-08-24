/** A simple box mathematical primitive. */
export class Box {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    toString() {
        return `${this.x} ${this.y} ${this.w} ${this.h}`;
    }
}
//# sourceMappingURL=box.js.map