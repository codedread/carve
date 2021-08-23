import { Point } from '../math/point.js';
import { SVGNS } from '../constants.js';
import { Tool } from './tool.js';
import { InsertElementCommand } from '../commands/insert-element-command.js';
/** A tool for drawing an ellipse. */
export class EllipseTool extends Tool {
    constructor(host) {
        super(host);
        this.isDrawing = false;
    }
    onMouseDown(evt) {
        this.isDrawing = true;
        this.startPoint = new Point(evt.carveX, evt.carveY);
        this.endPoint = new Point(evt.carveX, evt.carveY);
        const elem = document.createElementNS(SVGNS, 'ellipse');
        elem.setAttribute('cx', `${evt.carveX}`);
        elem.setAttribute('cy', `${evt.carveY}`);
        elem.setAttribute('fill', 'green');
        elem.setAttribute('stroke-width', '1');
        elem.setAttribute('stroke', 'black');
        this.drawingElem = elem;
        this.host.getOverlay().appendChild(elem);
        console.log(`EllipseTool: Started creating an ellipse`);
    }
    onMouseUp(evt) {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.endPoint = new Point(evt.carveX, evt.carveY);
            // Do not create a rect if it would be zero width/height.
            if (this.startPoint.x !== this.endPoint.x && this.startPoint.y !== this.endPoint.y) {
                this.host.execute(new InsertElementCommand(this.drawingElem));
                console.log(`EllipseTool: Created an ellipse`);
            }
            else {
                this.drawingElem.parentElement.removeChild(this.drawingElem);
                console.log(`EllipseTool: Abandoned creating an ellipse`);
            }
            this.host.getOverlay().innerHTML = '';
            this.cleanUp();
        }
    }
    onMouseMove(evt) {
        if (this.isDrawing) {
            this.endPoint.x = evt.carveX;
            this.endPoint.y = evt.carveY;
            this.drawingElem.setAttribute('rx', `${Math.abs(this.endPoint.x - this.startPoint.x)}`);
            this.drawingElem.setAttribute('ry', `${Math.abs(this.endPoint.y - this.startPoint.y)}`);
        }
    }
    cleanUp() {
        this.isDrawing = false;
        this.startPoint = null;
        this.endPoint = null;
        this.drawingElem = null;
    }
}
//# sourceMappingURL=ellipse.js.map