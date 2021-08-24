import { CarveAction } from './actions.js';
import { createDocumentFromFile, createNewDocument } from './document.js';
import { CarveMouseEvent } from './carve-mouse-event.js';
import { RectangleTool } from './tools/rectangle.js';
import { SVGNS } from './constants.js';
import { ToolbarClickedEvent, TOOLBAR_CLICKED_TYPE } from './toolbar-button.js';
import { keyToAction } from './keys.js';
import { EllipseTool } from './tools/ellipse.js';
import { Box } from './math/box.js';
const CARVE_TOP_DIV = 'carveTopDiv';
const CARVE_WORK_AREA = 'carveWorkArea';
const CARVE_BACKGROUND = 'carveBackground';
const CARVE_IMAGE = 'carveImage';
const CARVE_OVERLAY = 'carveOverlay';
/** The fraction of the Work Area that the canvas takes up. */
const L = 0.9;
/** The margin on either side of the canvas. */
const M = (1 - L) / 2;
/**
 * A CarveEditor can open a CarveDocument into the work area.
 */
export class CarveEditor extends HTMLElement {
    constructor() {
        super();
        this.viewBox = new Box();
        this.currentModeTool = null;
        this.createShadowDOM();
        // Set up tools.
        this.rectTool = new RectangleTool(this);
        this.ellipseTool = new EllipseTool(this);
        // Listen for events.
        window.addEventListener('keyup', this);
        this.addEventListener(TOOLBAR_CLICKED_TYPE, this);
        this.workArea.addEventListener('mousedown', this);
        this.workArea.addEventListener('mousemove', this);
        this.workArea.addEventListener('mouseup', this);
        // Create a new doc.
        createNewDocument().then(doc => this.switchDocument(doc));
    }
    execute(cmd) {
        cmd.apply(this);
        this.currentDoc.addCommandToStack(cmd);
    }
    getImage() {
        return this.topSVGElem.firstElementChild;
    }
    getOverlay() {
        return this.overlayElem;
    }
    handleEvent(e) {
        let action;
        if (e instanceof KeyboardEvent) {
            action = keyToAction(e.key);
        }
        else if (e instanceof ToolbarClickedEvent) {
            action = e.action;
        }
        else if (e instanceof MouseEvent && this.currentModeTool) {
            const cme = this.toCarveMouseEvent(e);
            switch (e.type) {
                case 'mousedown':
                    this.currentModeTool.onMouseDown(cme);
                    break;
                case 'mousemove':
                    this.currentModeTool.onMouseMove(cme);
                    break;
                case 'mouseup':
                    this.currentModeTool.onMouseUp(cme);
                    break;
            }
        }
        if (action) {
            switch (action) {
                case CarveAction.NEW_DOCUMENT:
                    this.doNewDoc();
                    break;
                case CarveAction.OPEN_DOCUMENT:
                    this.doOpenDoc();
                    break;
                case CarveAction.RECTANGLE_MODE:
                    this.querySelector('carve-rectangle-button').active = true;
                    this.currentModeTool = this.rectTool;
                    break;
                case CarveAction.ELLIPSE_MODE:
                    this.querySelector('carve-ellipse-button').active = true;
                    this.currentModeTool = this.ellipseTool;
                    break;
            }
        }
    }
    createShadowDOM() {
        const X = M * 100;
        const Y = M * 100;
        const W = L * 100;
        const H = L * 100;
        this.attachShadow({ mode: 'open' }).innerHTML = `
      <style type="text/css">
        #${CARVE_TOP_DIV} {
          position: relative;
          width: 100%;
          height: 100%;
        }
        #${CARVE_WORK_AREA} {
          background-color: lightgrey;
          position: absolute;
          height: calc(100% - 2em);
          left: 0;
          top: 3em;
          width: 100%;
        }
      </style>
      <div id="${CARVE_TOP_DIV}">
        <slot name="toolbar"></slot>
        <svg id="${CARVE_WORK_AREA}" xmlns="${SVGNS}" viewBox="0 0 100 100">
          <svg xmlns="${SVGNS}" id="${CARVE_BACKGROUND}" x="${X}" y="${Y}" width="${W}" height="${H}"
            viewBox="0 0 100 100">
            <rect width="100%" height="100%" fill="white" />
          </svg>
          <svg xmlns="${SVGNS}" id="${CARVE_IMAGE}" x="${X}" y="${Y}" width="${W}" height="${H}"></svg>
          <svg xmlns="${SVGNS}" id="${CARVE_OVERLAY}" x="${X}" y="${Y}" width="${W}" height="${H}"></svg>
        </svg>
      </div>
    `;
        this.workArea = this.shadowRoot.querySelector(`#${CARVE_WORK_AREA}`);
        this.backgroundElem = this.shadowRoot.querySelector(`#${CARVE_BACKGROUND}`);
        this.topSVGElem = this.shadowRoot.querySelector(`#${CARVE_IMAGE}`);
        this.overlayElem = this.shadowRoot.querySelector(`#${CARVE_OVERLAY}`);
    }
    async doNewDoc() {
        this.switchDocument(await createNewDocument());
    }
    async doOpenDoc() {
        if (window['showOpenFilePicker']) {
            try {
                const handleArray = await window['showOpenFilePicker']({
                    multiple: false,
                    types: [
                        {
                            description: 'SVG files',
                            // Add svgz to the accept extensions?
                            accept: { 'image/svg+xml': ['.svg'] },
                        },
                    ],
                });
                this.switchDocument(await createDocumentFromFile(handleArray[0]));
            }
            catch (err) {
                alert(err);
            }
        }
        // Else, do the old file picker input thing.
    }
    resizeWorkArea() {
        const vbstr = this.viewBox.toString();
        this.backgroundElem.setAttribute('viewBox', vbstr);
        this.topSVGElem.setAttribute('viewBox', vbstr);
        this.overlayElem.setAttribute('viewBox', vbstr);
    }
    switchDocument(doc) {
        if (doc !== this.currentDoc) {
            this.currentDoc = doc;
            // Clear out previous SVG doc.
            while (this.topSVGElem.hasChildNodes()) {
                this.topSVGElem.removeChild(this.topSVGElem.firstChild);
            }
            const svgDom = this.currentDoc.getSVG();
            this.topSVGElem.appendChild(svgDom);
            if (svgDom.hasAttribute('viewBox')) {
                const vbArray = svgDom.getAttribute('viewBox').split(' ');
                if (vbArray.length !== 4) {
                    console.error(`Cannot handle this viewBox: ${svgDom.getAttribute('viewBox')}`);
                }
                this.viewBox.x = parseFloat(vbArray[0]);
                this.viewBox.y = parseFloat(vbArray[1]);
                this.viewBox.w = parseFloat(vbArray[2]);
                this.viewBox.h = parseFloat(vbArray[3]);
            }
            else {
                console.error(`cannot handle an SVG image without a viewBox yet`);
            }
            this.resizeWorkArea();
        }
    }
    toCarveMouseEvent(mouseEvent) {
        const vbw = this.viewBox.w;
        const vbh = this.viewBox.h;
        let [carveX, carveY, carveMoveX, carveMoveY] = [0, 0, 0, 0];
        // Fractional coordinates (0.0 represents the left-most or top-most, 1.0 for right/bottom).
        let [fx, fy] = [0.0, 0.0];
        let x = mouseEvent.offsetX;
        let y = mouseEvent.offsetY;
        // Work area width and height.
        const waw = parseInt(window.getComputedStyle(this.workArea)['width'], 10);
        const wah = parseInt(window.getComputedStyle(this.workArea)['height'], 10);
        if (waw > wah) {
            // The window is wider than it is tall, therefore the height is 100% and the canvas is
            // centered width-wise with some padding on left/right.
            fy = (y - (wah * M)) / (wah * L);
            const diffW = (waw - wah) / 2;
            fx = (x - diffW - (wah * M)) / (wah * L);
            // TOOD: I don't think these are right. I think they need to be "spread" like fx, fy are.
            carveMoveX = this.viewBox.w * mouseEvent.movementX / (wah * L);
            carveMoveY = this.viewBox.h * mouseEvent.movementY / (wah * L);
        }
        else {
            // The window is taller than it is wide, therefore the width is 100% and the canvas is
            // centered height-wise with some padding on top/bottom.
            fx = (x - (waw * M)) / (waw * L);
            const diffH = (wah - waw) / 2;
            fy = (y - diffH - (waw * M)) / (waw * L);
            // TOOD: I don't think these are right. I think they need to be "spread" like fx, fy are.
            carveMoveX = this.viewBox.w * mouseEvent.movementX / (waw * L);
            carveMoveY = this.viewBox.h * mouseEvent.movementY / (waw * L);
        }
        // If the viewBox is not perfectly square, we need to "spread" either the x or the y coordinate
        // across the space to reach the bounds.
        if (this.viewBox.w < this.viewBox.h) {
            const slope = vbh / vbw;
            const yIntercept = -0.5 * (slope - 1);
            fx = slope * fx + yIntercept;
        }
        else if (this.viewBox.h < this.viewBox.w) {
            const slope = vbw / vbh;
            const yIntercept = -0.5 * (slope - 1);
            fy = slope * fy + yIntercept;
        }
        carveX = this.viewBox.w * fx + this.viewBox.x;
        carveY = this.viewBox.h * fy + this.viewBox.y;
        return new CarveMouseEvent(carveX, carveY, carveMoveX, carveMoveY, mouseEvent);
    }
}
//# sourceMappingURL=editor.js.map