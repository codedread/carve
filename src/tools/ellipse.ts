import { CarveMouseEvent } from '../carve-mouse-event.js';
import { InsertElementCommand } from '../commands/insert-element-command.js';
import { ModeTool } from './tool.js';
import { Point } from '../math/point.js';
import { SVGNS } from '../constants.js';
import { ToolbarModeButton } from '../toolbar-button.js';

export const ACTION_ELLIPSE_MODE = 'ellipse_mode';

/** A tool for drawing an ellipse. */
export class EllipseTool extends ModeTool {
  private isDrawing: boolean = false;
  private startPoint: Point;
  private endPoint: Point;
  private drawingElem: SVGEllipseElement;

  getActions(): string[] { return [ ACTION_ELLIPSE_MODE ]; }

  onMouseDown(evt: CarveMouseEvent) {
    this.isDrawing = true;
    this.startPoint = new Point(evt.carveX, evt.carveY);
    this.endPoint = new Point(evt.carveX, evt.carveY);

    const elem = document.createElementNS(SVGNS, 'ellipse');
    elem.setAttribute('cx', `${evt.carveX}`);
    elem.setAttribute('cy', `${evt.carveY}`);
    elem.setAttribute('fill', this.host.getDrawingStyle().fill);
    elem.setAttribute('stroke-width', '1');
    elem.setAttribute('stroke', this.host.getDrawingStyle().stroke);

    this.drawingElem = elem;
    this.host.getOverlay().appendChild(elem);
    console.log(`EllipseTool: Started creating an ellipse`);
  }

  onMouseUp(evt: CarveMouseEvent) {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.endPoint = new Point(evt.carveX, evt.carveY);

      // Remove the ellipse from the overlay.
      const ellipseEl = this.drawingElem.parentElement.removeChild(this.drawingElem);
      // TODO: Unit test that this is called.
      this.host.getSelection().clear();
      // Do not create shape if it would be zero width/height.
      if (this.startPoint.x !== this.endPoint.x && this.startPoint.y !== this.endPoint.y) {
        this.host.commandExecute(new InsertElementCommand(ellipseEl));
        console.log(`EllipseTool: Created an ellipse`);
      } else {
        console.log(`EllipseTool: Abandoned creating an ellipse`);
      }
      this.cleanUp();
    }
  }

  onMouseMove(evt: CarveMouseEvent) {
    if (this.isDrawing) {
      this.endPoint.x = evt.carveX;
      this.endPoint.y = evt.carveY;
      this.drawingElem.setAttribute('rx', `${Math.abs(this.endPoint.x - this.startPoint.x)}`);
      this.drawingElem.setAttribute('ry', `${Math.abs(this.endPoint.y - this.startPoint.y)}`);
    }
  }

  private cleanUp() {
    this.isDrawing = false;
    this.startPoint = null;
    this.endPoint = null;
    this.drawingElem = null;
  }
}

export class EllipseButton extends ToolbarModeButton {
  getAction(): string { return ACTION_ELLIPSE_MODE; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Ellipse Tool</title>
      <ellipse cx="50" cy="50" rx="40" ry="20" fill="green" stroke-width="4" stroke="black" />
    </svg>`;
  }
}
