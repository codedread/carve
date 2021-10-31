import { DrawingTool } from './tool.js';
import { InsertElementCommand } from '../commands/insert-element-command.js';
import { Point } from '../math/point.js';
import { SVGNS } from '../constants.js';
import { ToolbarModeButton } from '../toolbar-button.js';
export const ACTION_RECTANGLE_MODE = 'rectangle_mode';
/** A tool for drawing a rectangle. */
export class RectangleTool extends DrawingTool {
    startPoint;
    endPoint;
    drawingElem;
    getActions() { return [ACTION_RECTANGLE_MODE]; }
    onMouseDown(evt) {
        this.setIsDrawing(true);
        this.startPoint = new Point(evt.carveX, evt.carveY);
        this.endPoint = new Point(evt.carveX, evt.carveY);
        const elem = document.createElementNS(SVGNS, 'rect');
        elem.setAttribute('x', `${evt.carveX}`);
        elem.setAttribute('y', `${evt.carveY}`);
        elem.setAttribute('fill', this.host.getDrawingStyle().fill);
        elem.setAttribute('stroke-width', '1');
        elem.setAttribute('stroke', this.host.getDrawingStyle().stroke);
        this.drawingElem = elem;
        this.host.getOverlay().appendChild(elem);
        console.log(`RectangleTool: Started creating a rectangle`);
    }
    onMouseUp(evt) {
        if (this.getIsDrawing()) {
            this.endPoint = new Point(evt.carveX, evt.carveY);
            // TODO: Unit test that this is called.
            this.host.getSelection().clear();
            // Do not create shape if it would be zero width/height.
            if (this.startPoint.x !== this.endPoint.x && this.startPoint.y !== this.endPoint.y) {
                // Must remove drawingElem from the overlay so that if this command is undone, it is not
                // added back to the overlay layer.
                // TODO: Figure out a better way to do this.
                const rect = this.drawingElem.parentElement.removeChild(this.drawingElem);
                this.host.commandExecute(new InsertElementCommand(rect));
                console.log(`RectangleTool: Created a rectangle`);
            }
            else {
                console.log(`RectangleTool: Abandoned creating a rectangle`);
            }
            this.cleanUp();
        }
    }
    onMouseMove(evt) {
        if (this.getIsDrawing()) {
            this.endPoint.x = evt.carveX;
            this.endPoint.y = evt.carveY;
            this.drawingElem.setAttribute('width', `${Math.abs(this.endPoint.x - this.startPoint.x)}`);
            this.drawingElem.setAttribute('height', `${Math.abs(this.endPoint.y - this.startPoint.y)}`);
            this.drawingElem.setAttribute('x', `${(this.endPoint.x < this.startPoint.x) ? this.endPoint.x : this.startPoint.x}`);
            this.drawingElem.setAttribute('y', `${(this.endPoint.y < this.startPoint.y) ? this.endPoint.y : this.startPoint.y}`);
        }
    }
    /** @override */
    cleanUp() {
        super.cleanUp();
        this.startPoint = null;
        this.endPoint = null;
        // Always clean up the drawing element if it was left on the overlay layer.
        if (this.drawingElem && this.drawingElem.parentNode === this.host.getOverlay()) {
            this.drawingElem.parentElement.removeChild(this.drawingElem);
        }
        this.drawingElem = null;
    }
}
export class RectangleButton extends ToolbarModeButton {
    getAction() { return ACTION_RECTANGLE_MODE; }
    getButtonDOM() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Rectangle Tool</title>
      <rect x="15" y="30" width="70" height="40" fill="red" stroke-width="4" stroke="black" />
    </svg>`;
    }
}
//# sourceMappingURL=rectangle.js.map