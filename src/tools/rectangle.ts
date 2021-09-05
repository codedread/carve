import { CarveMouseEvent } from '../carve-mouse-event.js';
import { InsertElementCommand } from '../commands/insert-element-command.js';
import { ModeTool } from './tool.js';
import { Point } from '../math/point.js';
import { SVGNS } from '../constants.js';
import { ToolbarModeButton } from '../toolbar-button.js';

export const ACTION_RECTANGLE_MODE = 'rectangle_mode';

/** A tool for drawing a rectangle. */
export class RectangleTool extends ModeTool {
  private isDrawing: boolean = false;
  private startPoint: Point;
  private endPoint: Point;
  private drawingElem: SVGRectElement;

  getActions(): string[] { return [ ACTION_RECTANGLE_MODE ]; }

  onMouseDown(evt: CarveMouseEvent) {
    this.isDrawing = true;
    this.startPoint = new Point(evt.carveX, evt.carveY);
    this.endPoint = new Point(evt.carveX, evt.carveY);

    const elem = document.createElementNS(SVGNS, 'rect');
    elem.setAttribute('x', `${evt.carveX}`);
    elem.setAttribute('y', `${evt.carveY}`);
    elem.setAttribute('fill', 'red');
    elem.setAttribute('stroke-width', '1');
    elem.setAttribute('stroke', 'black');

    this.drawingElem = elem;
    this.host.getOverlay().appendChild(elem);
    console.log(`RectangleTool: Started creating a rectangle`);
  }

  onMouseUp(evt: CarveMouseEvent) {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.endPoint = new Point(evt.carveX, evt.carveY);

      // Do not create shape if it would be zero width/height.
      const rectElem = this.drawingElem.parentElement.removeChild(this.drawingElem);
      if (this.startPoint.x !== this.endPoint.x && this.startPoint.y !== this.endPoint.y) {
        // TODO: Unit test that this is called.
        this.host.getSelection().clear();
        this.host.commandExecute(new InsertElementCommand(rectElem));
        console.log(`RectangleTool: Created a rectangle`);
      } else {
        console.log(`RectangleTool: Abandoned creating a rectangle`);
      }

      this.host.getOverlay().innerHTML = '';
      this.cleanUp();
    }
  }

  onMouseMove(evt: CarveMouseEvent) {
    if (this.isDrawing) {
      this.endPoint.x = evt.carveX;
      this.endPoint.y = evt.carveY;
      this.drawingElem.setAttribute('width', `${Math.abs(this.endPoint.x - this.startPoint.x)}`);
      this.drawingElem.setAttribute('height', `${Math.abs(this.endPoint.y - this.startPoint.y)}`);
      this.drawingElem.setAttribute('x',
          `${(this.endPoint.x < this.startPoint.x) ? this.endPoint.x : this.startPoint.x}`);
      this.drawingElem.setAttribute('y',
          `${(this.endPoint.y < this.startPoint.y) ? this.endPoint.y : this.startPoint.y}`);
    }
  }

  private cleanUp() {
    this.isDrawing = false;
    this.startPoint = null;
    this.endPoint = null;
    this.drawingElem = null;
  }
}

export class RectangleButton extends ToolbarModeButton {
  getAction(): string { return ACTION_RECTANGLE_MODE; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Rectangle Tool</title>
      <rect x="15" y="30" width="70" height="40" fill="red" stroke-width="4" stroke="black" />
    </svg>`;
  }
}
