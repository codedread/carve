import { Box } from '../math/box.js';
import { CarveMouseEvent } from '../carve-mouse-event.js';
import { Matrix } from '../math/matrix.js';
import { ModeTool } from './tool.js';
import { Point } from '../math/point.js';
import { ToolbarModeButton } from '../toolbar-button.js';
import { decomposeMatrix } from '../math/matrix.js';

export const ACTION_SELECT_MODE = 'select_mode';

export class SimpleSelectTool extends ModeTool {
  /** How wide the stroke of the selector box is. */
  static readonly SELECTOR_STROKE_SCALE = 1/2;

  private mousedDownElem: SVGGraphicsElement = null;
  private isTransforming: boolean = false;
  private transformation: Matrix = null;

  getActions(): string[] { return [ ACTION_SELECT_MODE ]; }

  onMouseDown(evt: CarveMouseEvent) {
    let mousedElem = null;
    const image = this.host.getImage();
    // If the moused-upon element has the image as an ancestor, remember it.
    let node = evt.mouseEvent.target as Element;
    while (node) {
      if (node.parentElement as Element === image) {
        mousedElem = node; //evt.mouseEvent.target as SVGElement;
        break;
      }
      node = node.parentElement;
    }

    if (mousedElem) {
      this.mousedDownElem = mousedElem;
      this.host.getSelection().set([mousedElem]);
      this.transformBegin();
      this.updateSelectorElements();
    }
  }

  onMouseMove(evt: CarveMouseEvent) {
    // We only care if the user has the mouse button down and is dragging or
    // resizing a selected element.
    if (this.host.getSelection().isNonEmpty() && evt.mouseEvent.buttons === 1 && this.isTransforming) {
      this.moveSelected(evt.carveMoveX, evt.carveMoveY);
    }
  }

  onMouseUp(evt: CarveMouseEvent) {
    if (this.isTransforming) {
      this.isTransforming = false;
      this.transformFinish();
    }
  }

  /** @override */
  setActive(active: boolean) {
    super.setActive(active);
    if (!active) {
      this.resetSelection();
    }
  }

  private resetSelection() {
    this.host.getSelection().clear();
    this.host.getOverlay().innerHTML = '';
  }

  private moveSelected(dx: number, dy: number) {
    const moveVector = new Point(dx, dy);
    this.transformation = this.transformation.preMultiply(Matrix.translateBy(moveVector));
    const xformStr = this.transformation.toTransformString();
    this.mousedDownElem.setAttribute('transform', xformStr);
    this.host.getOverlay().querySelector('#selectorGroup').setAttribute('transform', xformStr);

    console.log(`moveVector = ${moveVector.toString()}`);
  }

  private transformBegin() {
    this.isTransforming = true;
    this.transformation = Matrix.fromSvgMatrix(this.mousedDownElem.getCTM());
  }

  private transformFinish() {
    this.isTransforming = false;
    if (this.transformation.equals(Matrix.identity())) {
      this.mousedDownElem.removeAttribute('transform');
      this.host.getOverlay().querySelector('#selectorGroup').removeAttribute('transform');
    }
    this.transformation = null;
  }

  private updateSelectorElements() {
    // Figure out the right stroke with based on current image's viewbox.
    // TODO: Turn this into a method and write some unit tests.
    const vb = this.host.getImage().getAttribute('viewBox');
    const box = Box.fromViewBoxString(vb);
    const dimension = Math.min(box.w, box.h);
    // Default dimension is 100
    let strokeWidth = (dimension / 100) * SimpleSelectTool.SELECTOR_STROKE_SCALE;
    let strokeDashArray = (2 * dimension / 100) * SimpleSelectTool.SELECTOR_STROKE_SCALE;

    const {x, y, w, h} = this.host.getSelection().getBBox();
    let xformstr = ` transform="${this.transformation.toTransformString()}"`;
    // Add something to the overlay layer.
    const overlay = this.host.getOverlay();
    overlay.innerHTML = `<g id="selectorGroup"${xformstr}>
      <rect id="selectorBox" fill="none" stroke="#08f"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${strokeDashArray}"
            x="${x}" y="${y}" width="${w}" height="${h}" />
    </g>`;
  }
}

export class SimpleSelectButton extends ToolbarModeButton {
  getAction(): string { return ACTION_SELECT_MODE; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <title>Select Tool</title>
        <path d="M50,15 l20,35 l-16,-3 v35 h-8 v-35 l-16,3 z" transform="rotate(-45,50,50)"
              fill="white" stroke="black" stroke-width="3" />
      </svg>`;
  }
}
