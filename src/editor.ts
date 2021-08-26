import { CarveAction } from './actions.js';
import { CarveDocument, createDocumentFromFile, createNewDocument } from './document.js';
import { CarveMouseEvent } from './carve-mouse-event.js';
import { CarveRectangleButton, CarveEllipseButton } from './core-toolbar-buttons.js';
import { Command } from './commands/command.js';
import { EditorHost } from './editor-host.js';
import { FileSystemFileHandle } from './types/filesystem.js';
import { RectangleTool } from './tools/rectangle.js';
import { SVGNS } from './constants.js';
import { Tool, ModeTool, SimpleActionTool } from './tools/tool.js';
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

/** An interface for how to configure the UI custom element. */
export interface ActionElementConfig {
  /** The constructor for the UI custom element. */
  ctor: typeof HTMLElement;
}

/** A CarveEditor can open a CarveDocument into the work area. */
export class CarveEditor extends HTMLElement implements EditorHost {
  private currentDoc: CarveDocument;

  private workArea: SVGSVGElement;
  private backgroundElem: SVGElement;
  private topSVGElem: SVGSVGElement;
  private overlayElem: SVGSVGElement;
  private viewBox: Box = new Box();

  private toolActionRegistry: Map<string, Tool> = new Map();

  private currentModeTool: ModeTool = null;

  // Known tools.
  private rectTool: RectangleTool;
  private ellipseTool: EllipseTool;

  constructor() {
    super();
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
      if (this.toolActionRegistry.has(action)) {
        const tool = this.toolActionRegistry.get(action);
        if (tool instanceof SimpleActionTool) {
          tool.onDo();
        } else if (tool instanceof ModeTool) {
          this.currentModeTool = tool;
        }
      } else {
        // Remove all this eventually.
        switch (action) {
          case CarveAction.OPEN_DOCUMENT: this.doOpenDoc(); break;
          case CarveAction.RECTANGLE_MODE:
            (this.querySelector('carve-rectangle-button') as CarveRectangleButton).active = true;
            this.currentModeTool = this.rectTool;
            break;
          case CarveAction.ELLIPSE_MODE:
            (this.querySelector('carve-ellipse-button') as CarveEllipseButton).active = true;
            this.currentModeTool = this.ellipseTool;
            break;
        }
      }
    }
  }

  /**
   * Registers a tool with the Editor by its actions. Also registers any custom elements in the
   * custom elements map.
   */
  registerTool(ctor: typeof Tool,
               customElementsMap: {[tagName: string]: ActionElementConfig} = null) {
    const tool = new ctor(this);
    for (const action of tool.getActions()) {
      this.registerToolForAction(action, tool);
    }
    for (const [tagName, config] of Object.entries(customElementsMap)) {
      customElements.define(tagName, config.ctor);
    }
  }

  /** Switches the current document of the Editor to a new document. */
  switchDocument(doc: CarveDocument) {
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
      } else {
        console.error(`cannot handle an SVG image without a viewBox yet`);
      }

      this.resizeWorkArea();
    }
  }

  /** Registers a tool to handle a given action. */
  private registerToolForAction(action: string, tool: Tool) {
    if (this.toolActionRegistry.has(action)) {
      throw `Already registered a tool to handle action '${action}`;
    }
    this.toolActionRegistry.set(action, tool);
  }

  private createShadowDOM() {
    const X = M*100;
    const Y = M*100;
    const W = L*100;
    const H = L*100;
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

  private resizeWorkArea() {
    const vbstr = this.viewBox.toString();
    this.backgroundElem.setAttribute('viewBox', vbstr);
    this.topSVGElem.setAttribute('viewBox', vbstr);
    this.overlayElem.setAttribute('viewBox', vbstr);
  }

  private toCarveMouseEvent(mouseEvent: MouseEvent): CarveMouseEvent {
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
    } else {
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
    } else if (this.viewBox.h < this.viewBox.w) {
      const slope = vbw / vbh;
      const yIntercept = -0.5 * (slope - 1);
      fy = slope * fy + yIntercept;
    }

    carveX = this.viewBox.w * fx + this.viewBox.x;
    carveY = this.viewBox.h * fy + this.viewBox.y;

    return new CarveMouseEvent(carveX, carveY, carveMoveX, carveMoveY, mouseEvent);
  }
}

customElements.define('carve-editor', CarveEditor);
