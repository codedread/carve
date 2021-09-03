/** Wrapper of a MouseEvent with Carve-space coordinates */
export class CarveMouseEvent {
    carveX;
    carveY;
    carveMoveX;
    carveMoveY;
    mouseEvent;
    constructor(carveX, carveY, carveMoveX, carveMoveY, mouseEvent) {
        this.carveX = carveX;
        this.carveY = carveY;
        this.carveMoveX = carveMoveX;
        this.carveMoveY = carveMoveY;
        this.mouseEvent = mouseEvent;
    }
}
/**
 * @param mouseEvent The original mouse event.
 * @param viewBox
 * @param waw Work Area width
 * @param wah Work Area height
 * @param waFraction The percent that the work area takes up.
 * @param waMargin The margin of the work area, as a fraction.
 * @returns
 */
export function toCarveMouseEvent(mouseEvent, viewBox, waw, wah, waFraction, waMargin) {
    const vbw = viewBox.w;
    const vbh = viewBox.h;
    let [carveX, carveY, carveMoveX, carveMoveY] = [0, 0, 0, 0];
    // Fractional coordinates (0.0 represents the left-most or top-most, 1.0 for right/bottom).
    let [fx, fy] = [0.0, 0.0];
    let x = mouseEvent.offsetX;
    let y = mouseEvent.offsetY;
    // Work area width and height.
    if (waw > wah) {
        // The window is wider than it is tall, therefore the height is 100% and the canvas is
        // centered width-wise with some padding on left/right.
        fy = (y - (wah * waMargin)) / (wah * waFraction);
        const diffW = (waw - wah) / 2;
        fx = (x - diffW - (wah * waMargin)) / (wah * waFraction);
        // TOOD: I don't think these are right. I think they need to be "spread" like fx, fy are.
        carveMoveX = viewBox.w * mouseEvent.movementX / (wah * waFraction);
        carveMoveY = viewBox.h * mouseEvent.movementY / (wah * waFraction);
    }
    else {
        // The window is taller than it is wide, therefore the width is 100% and the canvas is
        // centered height-wise with some padding on top/bottom.
        fx = (x - (waw * waMargin)) / (waw * waFraction);
        const diffH = (wah - waw) / 2;
        fy = (y - diffH - (waw * waMargin)) / (waw * waFraction);
        // TOOD: I don't think these are right. I think they need to be "spread" like fx, fy are.
        carveMoveX = viewBox.w * mouseEvent.movementX / (waw * waFraction);
        carveMoveY = viewBox.h * mouseEvent.movementY / (waw * waFraction);
    }
    // If the viewBox is not perfectly square, we need to "spread" either the x or the y coordinate
    // across the space to reach the bounds.
    if (viewBox.w < viewBox.h) {
        const slope = vbh / vbw;
        const yIntercept = -0.5 * (slope - 1);
        fx = slope * fx + yIntercept;
    }
    else if (viewBox.h < viewBox.w) {
        const slope = vbw / vbh;
        const yIntercept = -0.5 * (slope - 1);
        fy = slope * fy + yIntercept;
    }
    carveX = viewBox.w * fx + viewBox.x;
    carveY = viewBox.h * fy + viewBox.y;
    return new CarveMouseEvent(carveX, carveY, carveMoveX, carveMoveY, mouseEvent);
}
//# sourceMappingURL=carve-mouse-event.js.map