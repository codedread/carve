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
    static fromViewBoxString(viewBox) {
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
//# sourceMappingURL=box.js.map