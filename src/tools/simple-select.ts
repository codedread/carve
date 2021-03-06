import { Box } from '../math/box.js';
import { CarveMouseEvent } from '../carve-mouse-event.js';
import { ChangeAttributeCommand } from '../commands/change-attribute-command.js';
import { EditorHost } from '../editor-host.js';
import { Matrix } from '../math/matrix.js';
import { ModeTool } from './tool.js';
import { Point } from '../math/point.js';
import { SelectionEvent } from '../selection.js';
import { SelectionOverlay } from './selection-overlay.js';
import { ToolbarModeButton } from '../toolbar-button.js';

export const ACTION_SELECT_MODE = 'select_mode';

/**
 * A tool that lets users select a single shape in the drawing and drag-move it.
 */
export class SimpleSelectTool extends ModeTool {
  /** How wide the stroke of the selector box is. */
  static readonly SELECTOR_STROKE_SCALE = 1/2;

  private mousedDownElem: SVGGraphicsElement = null;
  private isTransforming: boolean = false;
  private selectedElemOldTransformString: string = null;
  private selectedElemTransform: Matrix = null;
  private selectorGroupTransform: Matrix = null;

  private selectionOverlay: SelectionOverlay;

  constructor(host: EditorHost) {
    super(host);
    this.selectionOverlay = new SelectionOverlay(this.host, SimpleSelectTool.name);

    // This can happen, for example, if a drag-move was undone (the selection is reset).
    this.host.getSelection().addEventListener(SelectionEvent.TYPE, (evt: SelectionEvent) => {
      if (evt.selectedElements.length === 0) {
        // Clear the selectorGroup from the work area.
        this.selectionOverlay.hide();
      }
    });
  }

  getActions(): string[] { return [ ACTION_SELECT_MODE ]; }
  /** Visible for testing. */
  getOverlayUI(): SelectionOverlay { return this.selectionOverlay; }

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
      this.cleanUp();
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
  protected cleanUp() {
    this.host.getSelection().clear();
    this.selectionOverlay.hide();
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
    this.selectionOverlay.update({transform: this.selectorGroupTransform});
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
    this.selectionOverlay.update({
      x,
      y,
      width: w,
      height: h,
      strokeWidth,
      strokeDashArray,
      transform: this.selectorGroupTransform
    });
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
