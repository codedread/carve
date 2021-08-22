/** Wrapper of a MouseEvent with Carve-space coordinates */
export class CarveMouseEvent {
    constructor(carveX, carveY, carveMoveX, carveMoveY, mouseEvent) {
        this.carveX = carveX;
        this.carveY = carveY;
        this.carveMoveX = carveMoveX;
        this.carveMoveY = carveMoveY;
        this.mouseEvent = mouseEvent;
    }
}
//# sourceMappingURL=carve-mouse-event.js.map