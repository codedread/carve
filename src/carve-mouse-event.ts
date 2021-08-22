/** Wrapper of a MouseEvent with Carve-space coordinates */
export class CarveMouseEvent {
  constructor(public carveX: number,
              public carveY: number,
              public carveMoveX: number,
              public carveMoveY: number,
              public mouseEvent: MouseEvent) {}
}
