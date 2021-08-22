import { Point } from '../math/point.js';
import { SVGNS } from '../constants.js';
import { Tool } from './tool.js';
import { InsertElementCommand } from '../commands/insert-element-command.js';
/** A tool for drawing a rectangle. */
export class RectangleTool extends Tool {
    constructor(host) {
        super(host);
        this.isDrawing = false;
    }
    onMouseDown(evt) {
        this.isDrawing = true;
        this.startPoint = new Point(evt.carveX, evt.carveY);
        this.endPoint = new Point(evt.carveX, evt.carveY);
        const elem = document.createElementNS(SVGNS, 'rect');
        elem.setAttribute('x', `${evt.carveX}`);
        elem.setAttribute('y', `${evt.carveY}`);
        elem.setAttribute('fill', 'red');
        this.drawingElem = elem;
        this.host.getOverlay().appendChild(elem);
        console.log(`RectangleTool: Started creating a rectangle`);
    }
    onMouseUp(evt) {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.endPoint = new Point(evt.carveX, evt.carveY);
            // Do not create a rect if it would be zero width/height.
            if (this.startPoint.x !== this.endPoint.x && this.startPoint.y !== this.endPoint.y) {
                this.host.execute(new InsertElementCommand(this.drawingElem));
                console.log(`RectangleTool: Created a rectangle`);
            }
            else {
                this.drawingElem.parentElement.removeChild(this.drawingElem);
                console.log(`RectangleTool: Abandoned creating a rectangle`);
            }
            this.host.getOverlay().innerHTML = '';
            this.cleanUp();
        }
    }
    onMouseMove(evt) {
        if (this.isDrawing) {
            this.endPoint.x = evt.carveX;
            this.endPoint.y = evt.carveY;
            this.drawingElem.setAttribute('width', `${Math.abs(this.endPoint.x - this.startPoint.x)}`);
            this.drawingElem.setAttribute('height', `${Math.abs(this.endPoint.y - this.startPoint.y)}`);
            this.drawingElem.setAttribute('x', `${(this.endPoint.x < this.startPoint.x) ? this.endPoint.x : this.startPoint.x}`);
            this.drawingElem.setAttribute('y', `${(this.endPoint.y < this.startPoint.y) ? this.endPoint.y : this.startPoint.y}`);
        }
    }
    cleanUp() {
        this.isDrawing = false;
        this.startPoint = null;
        this.endPoint = null;
        this.drawingElem = null;
    }
}
//# sourceMappingURL=rectangle.js.map