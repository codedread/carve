import { Box } from '../math/box.js';
import { CarveMouseEvent } from '../carve-mouse-event.js';
import { Matrix } from '../math/matrix.js';
import { ModeTool } from './tool.js';
import { Point } from '../math/point.js';
import { ToolbarModeButton } from '../toolbar-button.js';
import { decomposeMatrix } from '../math/matrix.js';
import { ChangeAttributeCommand } from '../commands/change-attribute-command.js';
import { EditorHost } from '../editor-host.js';
import { SelectionEvent } from '../selection.js';

export const ACTION_SELECT_MODE = 'select_mode';

export class SimpleSelectTool extends ModeTool {
  /** How wide the stroke of the selector box is. */
  static readonly SELECTOR_STROKE_SCALE = 1/2;

  private mousedDownElem: SVGGraphicsElement = null;
  private isTransforming: boolean = false;
  private selectedElemOldTransformString: string = null;
  private selectedElemTransform: Matrix = null;
  private selectorGroupTransform: Matrix = null;

  constructor(host: EditorHost) {
    super(host);
    // This can happen, for example, if a drag-move was undone (the selection is reset).
    this.host.getSelection().addEventListener(SelectionEvent.TYPE, (evt: SelectionEvent) => {
      if (evt.selectedElements.length === 0) {
        // Clear the selectorGroup from the work area.
        this.host.getOverlay().innerHTML = '';
      }
    });
  }

  getActions(): string[] { return [ ACTION_SELECT_MODE ]; }

  onMouseDown(evt: CarveMouseEvent) {
    let mousedElem = null;
    const image = this.host.getCurrentDocument().getSVG();
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
      this.maybeUpdateDrawingStyle();
      this.transformBegin();
      this.updateSelectorElements();
    } else {
      this.resetSelection();
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

  private maybeUpdateDrawingStyle() {
    const selection = this.host.getSelection();
    // If it is not a single element, we cannot update the editor's drawing style to match the
    // selected elements.
    if (selection.elements().length !== 1) {
      return;
    }

    const drawingStyle = this.host.getDrawingStyle();
    const elem = selection.elements()[0];
    const fill = elem.getAttribute('fill');
    const stroke = elem.getAttribute('stroke');
    let changed = false;
    if (fill && fill !== drawingStyle.fill) {
      drawingStyle.fill = fill;
      changed = true;
    }
    if (stroke && stroke !== drawingStyle.stroke) {
      drawingStyle.stroke = stroke;
      changed = true;
    }
    if (changed) {
      this.host.setDrawingStyle(drawingStyle);
    }
  }

  private moveSelected(dx: number, dy: number) {
    const moveVector = new Point(dx, dy);
    if (moveVector.x === 0 && moveVector.y === 0) {
      return;
    }

    this.selectedElemTransform = this.selectedElemTransform.preMultiply(Matrix.translateBy(moveVector));
    this.mousedDownElem.setAttribute('transform', this.selectedElemTransform.toTransformString());

    this.selectorGroupTransform = this.selectorGroupTransform.preMultiply(Matrix.translateBy(moveVector));
    this.host.getOverlay().querySelector('#selectorGroup').setAttribute('transform',
        this.selectorGroupTransform.toTransformString());
  }

  private transformBegin() {
    this.isTransforming = true;
    if (this.mousedDownElem.hasAttribute('transform')) {
      this.selectedElemOldTransformString = this.mousedDownElem.getAttribute('transform');
    } else {
      this.selectedElemOldTransformString = null;
    }
    let matrix: Matrix = Matrix.fromSvgMatrix(this.mousedDownElem.getCTM());
    this.selectorGroupTransform = matrix.clone();

    // Adjust it by the viewBox x,y, if necessary.
    const box = Box.fromViewBoxString(this.host.getCurrentDocument().getSVG().getAttribute('viewBox'));
    if (box.x !== 0 || box.y !== 0) {
      matrix = matrix.preMultiply(Matrix.translateBy(new Point(box.x, box.y)));
    }
    this.selectedElemTransform = matrix;
  }

  private transformFinish() {
    this.isTransforming = false;
    let newTransformString = this.mousedDownElem.getAttribute('transform');
    if (newTransformString === this.selectedElemOldTransformString) {
      return;
    }

    if (this.selectedElemTransform.equals(Matrix.identity())) {
      this.mousedDownElem.removeAttribute('transform');
      this.host.getOverlay().querySelector('#selectorGroup').removeAttribute('transform');
      newTransformString = null;
    }
    this.selectedElemTransform = null;
    this.selectorGroupTransform = null;

    this.host.commandExecute(new ChangeAttributeCommand(this.mousedDownElem, 'transform',
                             this.selectedElemOldTransformString, newTransformString));;
  }

  private updateSelectorElements() {
    // Figure out the right stroke with based on current image's viewbox.
    // TODO: Turn this into a method and write some unit tests.
    const vb = this.host.getCurrentDocument().getSVG().getAttribute('viewBox');
    const box = Box.fromViewBoxString(vb);
    const dimension = Math.min(box.w, box.h);
    // Default dimension is 100
    let strokeWidth = (dimension / 100) * SimpleSelectTool.SELECTOR_STROKE_SCALE;
    let strokeDashArray = (2 * dimension / 100) * SimpleSelectTool.SELECTOR_STROKE_SCALE;

    const {x, y, w, h} = this.host.getSelection().getBBox();
    // Add something to the overlay layer.
    const overlay = this.host.getOverlay();
    overlay.innerHTML = `<g id="selectorGroup" transform="${this.selectorGroupTransform.toTransformString()}">
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
