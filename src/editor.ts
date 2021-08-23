import { CarveAction } from './actions.js';
import { CarveDocument, createDocumentFromFile, createNewDocument } from './document.js';
import { CarveMouseEvent } from './carve-mouse-event.js';
import { CarveRectangleButton } from './core-toolbar-buttons.js';
import { Command } from './commands/command.js';
import { EditorHost } from './editor-host.js';
import { FileSystemFileHandle } from './types/filesystem.js';
import { RectangleTool } from './tools/rectangle.js';
import { SVGNS } from './constants.js';
import { Tool } from './tools/tool.js';
import { ToolbarClickedEvent, TOOLBAR_CLICKED_TYPE } from './toolbar-button.js';
import { keyToAction } from './keys.js';

const CARVE_TOP_DIV = 'carveTopDiv';
const CARVE_WORK_AREA = 'carveWorkArea';
const CARVE_BACKGROUND = 'carveBackground';
const CARVE_IMAGE = 'carveImage';
const CARVE_OVERLAY = 'carveOverlay';

/**
 * A CarveEditor can open a CarveDocument into the work area.
 */
export class CarveEditor extends HTMLElement implements EditorHost {
  private currentDoc: CarveDocument;

  private workArea: SVGSVGElement;
  private topSVGElem: SVGSVGElement;
  private overlayElem: SVGSVGElement;
  private viewBoxW: number;
  private viewBoxH: number;
  private currentModeTool: Tool = null;

  // Known tools.
  private rectTool: RectangleTool;

  constructor() {
    super();
    this.createShadowDOM();

    // Set up tools.
    this.rectTool = new RectangleTool(this);

    // Listen for events.
    window.addEventListener('keyup', this);
    this.addEventListener(TOOLBAR_CLICKED_TYPE, this);
    this.workArea.addEventListener('mousedown', this);
    this.workArea.addEventListener('mousemove', this);
    this.workArea.addEventListener('mouseup', this);

    // Create a new doc.
    createNewDocument().then(doc => this.switchDocument(doc));
  }

  execute(cmd: Command) {
    cmd.apply(this);
    this.currentDoc.addCommandToStack(cmd);
  }

  getImage(): SVGSVGElement {
    return this.topSVGElem.firstElementChild as SVGSVGElement;
  }

  getOverlay(): SVGSVGElement {
    return this.overlayElem;
  }

  handleEvent(e: Event) {
    let action: CarveAction;
    if (e instanceof KeyboardEvent) {
      action = keyToAction(e.key);
    } else if (e instanceof ToolbarClickedEvent) {
      action = e.action;
    } else if (e instanceof MouseEvent && this.currentModeTool) {
      const cme = this.toCarveMouseEvent(e);
      switch (e.type) {
        case 'mousedown': this.currentModeTool.onMouseDown(cme); break;
        case 'mousemove': this.currentModeTool.onMouseMove(cme); break;
        case 'mouseup': this.currentModeTool.onMouseUp(cme); break;
      }
    }

    if (action) {
      switch (action) {
        case CarveAction.NEW_DOCUMENT: this.doNewDoc(); break;
        case CarveAction.OPEN_DOCUMENT: this.doOpenDoc(); break;
        case CarveAction.RECTANGLE_MODE:
          (this.querySelector('carve-rectangle-button') as CarveRectangleButton).active = true;
          this.currentModeTool = this.rectTool;
          break;
      }
    }
  }

  private createShadowDOM() {
    this.attachShadow({mode: 'open'}).innerHTML = `
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
          <svg id="${CARVE_BACKGROUND}" xmlns="${SVGNS}" x="5" y="5" width="90" height="90" viewBox="0 0 100 100">
            <rect x="0" y="0" width="100" height="100" fill="white" />
          </svg>
          <svg xmlns="${SVGNS}" id="${CARVE_IMAGE}" x="5" y="5" width="90" height="90"></svg>
          <svg xmlns="${SVGNS}" id="${CARVE_OVERLAY}" x="5" y="5" width="90" height="90"></svg>
        </svg>
      </div>
    `;
    this.workArea = this.shadowRoot.querySelector(`#${CARVE_WORK_AREA}`);
    this.topSVGElem = this.shadowRoot.querySelector(`#${CARVE_IMAGE}`);
    this.overlayElem = this.shadowRoot.querySelector(`#${CARVE_OVERLAY}`);
  }

  private async doNewDoc() {
    this.switchDocument(await createNewDocument());
  }

  private async doOpenDoc() {
    if (window['showOpenFilePicker']) {
      try {
        const handleArray: FileSystemFileHandle[] = await window['showOpenFilePicker']({
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
      } catch (err) {
        alert(err);
      }
    }
    // Else, do the old file picker input thing.
  }

  private switchDocument(doc: CarveDocument) {
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
        if (vbArray.length !== 4 || vbArray[0] !== '0' || vbArray[1] !== '0') {
          console.error(`Cannot handle this viewBox yet: ${svgDom.getAttribute('viewBox')}`);
        }
        this.viewBoxW = parseFloat(vbArray[2]);
        this.viewBoxH = parseFloat(vbArray[3]);
      } else {
        console.error(`cannot handle an SVG image without a viewBox yet`);
      }

      const viewBox = `0 0 ${this.viewBoxW} ${this.viewBoxH}`;
      this.topSVGElem.setAttribute('viewBox', viewBox);
      this.overlayElem.setAttribute('viewBox', viewBox);
    }
  }

  private toCarveMouseEvent(mouseEvent: MouseEvent): CarveMouseEvent {
    let [carveX, carveY, carveMoveX, carveMoveY] = [0, 0, 0, 0];

    let x = mouseEvent.offsetX;
    let y = mouseEvent.offsetY;
    const waw = parseInt(window.getComputedStyle(this.workArea)['width'], 10);
    const wah = parseInt(window.getComputedStyle(this.workArea)['height'], 10);
    if (waw > wah) {
      // The window is wider than it is tall, therefore the height is 100% and the canvas is centered
      // width-wise.

      // The canvas is 90% of the height and offset by 5%.
      carveY = this.viewBoxH * (y - (wah * 0.05)) / (wah * 0.9);

      const diffW = (waw - wah) / 2;
      carveX = this.viewBoxW * (x - diffW - (wah * 0.05)) / (wah * 0.9);

      carveMoveX = this.viewBoxW * mouseEvent.movementX / (wah * 0.9);
      carveMoveY = this.viewBoxH * mouseEvent.movementY / (wah * 0.9);
    } else {
      // The window is taller than it is wide, therefore the width is 100% and the canvas is centered
      // height-wise.

      // The canvas is 90% of the height and offset by 5%.
      carveX = this.viewBoxW * (x - (waw * 0.05)) / (waw * 0.9);

      const diffH = (wah - waw) / 2;
      carveY = this.viewBoxH * (y - diffH - (waw * 0.05)) / (waw * 0.9);

      carveMoveX = this.viewBoxW * mouseEvent.movementX / (waw * 0.9);
      carveMoveY = this.viewBoxH * mouseEvent.movementY / (waw * 0.9);
    }

    return new CarveMouseEvent(carveX, carveY, carveMoveX, carveMoveY, mouseEvent);
  }
}
