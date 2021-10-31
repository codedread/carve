import { Box } from './math/box.js';
import { CarveDocument, createNewDocument } from './document/document.js';
import { toCarveMouseEvent } from './carve-mouse-event.js';
import { Command } from './commands/command.js';
import { CommandStateChangedEvent } from './history.js';
import { EditorHost } from './editor-host.js';
import { Selection, SelectionEvent } from './selection.js';
import { SVGNS } from './constants.js';
import { Tool, ModeTool, SimpleActionTool, DrawingTool } from './tools/tool.js';
import { ToolbarButton, ToolbarClickedEvent } from './toolbar-button.js';
import { DrawingStyle, DEFAULT_DRAWING_STYLE, DrawingStyleChangedEvent } from './drawing-style.js';
import { createKeyStringFromKeyboardEvent, createKeyStringFromKeys } from './key-handler.js';

const CARVE_TOP_DIV = 'carveTopDiv';
const CARVE_WORK_AREA = 'carveWorkArea';
const CARVE_BACKGROUND = 'carveBackground';
const CARVE_IMAGE = 'carveImage';
const CARVE_OVERLAY = 'carveOverlay';

/** The fraction of the Work Area that the canvas takes up. */
const L = 0.9;
/** The margin on either side of the canvas. */
const M = (1 - L) / 2;

export const ACTION_STOP_DRAWING = 'stop_drawing';

/** An interface for how to configure the UI custom element. */
export interface ActionElementConfig {
  /** The constructor for the UI custom element. */
  ctor: typeof ToolbarButton;
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
  private keyActionRegistry: Map<string, string> = new Map();
  
  // Editor state. Changes here are not undo-able.
  private currentSelection: Selection = new Selection();
  private currentModeTool: ModeTool = null;
  private currentDrawingStyle: DrawingStyle = DEFAULT_DRAWING_STYLE;

  constructor() {
    super();
    this.createShadowDOM();

    // Listen for events.
    window.addEventListener('keydown', this, true);
    window.addEventListener('keyup', this, true);
    this.addEventListener(ToolbarClickedEvent.TYPE, this);
    this.currentSelection.addEventListener(SelectionEvent.TYPE, this);
    ['mousedown', 'mousemove', 'mouseup'].forEach(t => this.workArea.addEventListener(t, this));

    // Create a new doc.
    createNewDocument().then(doc => this.switchDocument(doc));
  }

  /** Executes the command and broadcasts that the command stack state has changed. */
  commandExecute(cmd: Command) {
    const cmdStack = this.currentDoc.getCommandStack();
    cmdStack.addCommand(this, cmd);
    this.dispatchEvent(new CommandStateChangedEvent(cmdStack.getIndex(), cmdStack.getLength()));
  }

  /** Re-applies the next command and broadcasts that the command stack state has changed. */
  commandReexecute() {
    const cmdStack = this.currentDoc.getCommandStack();
    if (cmdStack.redo(this)) {
      this.dispatchEvent(new CommandStateChangedEvent(cmdStack.getIndex(), cmdStack.getLength()));
    }
  }

  /** Un-applies the last command and broadcasts that the command stack state has changed. */
  commandUnexecute() {
    const cmdStack = this.currentDoc.getCommandStack();
    if (cmdStack.undo(this)) {
      this.dispatchEvent(new CommandStateChangedEvent(cmdStack.getIndex(), cmdStack.getLength()));
    }
  }

  getCurrentDocument(): CarveDocument { return this.currentDoc; }
  getDrawingStyle(): DrawingStyle { return {...this.currentDrawingStyle}; }
  getOverlay(): SVGSVGElement { return this.overlayElem; }
  getSelection(): Selection { return this.currentSelection; }

  handleEvent(e: Event) {
    let action: string;
    if (e instanceof KeyboardEvent) {
      let keyString = createKeyStringFromKeyboardEvent(e);
      if (this.keyActionRegistry.has(keyString)) {
        action = this.keyActionRegistry.get(keyString);
        console.log(`Found action ${action} for ${keyString}`);
        // Cancel any browser default actions.
        if (action && e.type === 'keydown') {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    } else if (e instanceof ToolbarClickedEvent) {
      action = e.action;
    } else if (e instanceof MouseEvent && this.currentModeTool) {
      const style = window.getComputedStyle(this.workArea);
      const cme = toCarveMouseEvent(e, this.viewBox, parseInt(style['width'], 10),
          parseInt(style['height'], 10), L, M);
      switch (e.type) {
        case 'mousedown': this.currentModeTool.onMouseDown(cme); break;
        case 'mousemove': this.currentModeTool.onMouseMove(cme); break;
        case 'mouseup': this.currentModeTool.onMouseUp(cme); break;
      }
    }

    if (action) {
      if (action === ACTION_STOP_DRAWING && this.currentModeTool instanceof DrawingTool) {
        this.currentModeTool.stopDrawing();
      } else {
        const tool = this.toolActionRegistry.get(action);
        console.log(`Resolved ${e.type} event into ${action} action, ${tool.constructor.name}`);
        if (tool && !tool.isDisabled()) {
          if (tool instanceof SimpleActionTool) {
            tool.onDo(action);
          } else if (tool instanceof ModeTool) {
            if (this.currentModeTool !== tool) {
              if (this.currentModeTool) {
                this.currentModeTool.setActive(false);
              }
              this.currentModeTool = tool;
              this.currentModeTool.setActive(true);
            }
          }
        }
      }
    }
  }

  /**
   * Registers an Action with the Editor by its key combination, which must be unique. The keys
   * array must include at least one non-modifier character.
   */
  registerActionForKeyBinding(action: string, keys: string[]): CarveEditor {
    const keyString = createKeyStringFromKeys(keys);
    if (action !== ACTION_STOP_DRAWING && !this.toolActionRegistry.has(action)) {
      throw `Key binding attempted for action '${action}' without a registered tool.`;
    }

    if (this.keyActionRegistry.has(keyString)) {
      throw `Key binding for '${keyString}' already bound to action '${action}'`;
    }

    this.keyActionRegistry.set(keyString, action);
    console.log(`Bound ${action} to ${keyString}`);
    return this;
  }

  /**
   * Registers a tool with the Editor by its actions. Also registers any custom elements in the
   * custom elements map, binding them to the tool.
   */
  registerTool(ctor: typeof Tool,
               customElementsMap: {[tagName: string]: ActionElementConfig} = null): CarveEditor {
    const tool = new ctor(this);
    tool.getActions().forEach(action => this.registerToolForAction(action, tool));
    for (const [tagName, config] of Object.entries(customElementsMap)) {
      // Register an anonymous class that extends the passed-in constructor but encloses the
      // tool so that the UI element has a reference to the tool and can subscribe to its events.
      customElements.define(tagName, class extends config.ctor {
        constructor() { super(tool); }
      });
    }
    return this;
  }

  setDrawingStyle(drawingStyle: DrawingStyle) {
    const oldDrawingStyle = {...this.currentDrawingStyle};
    this.currentDrawingStyle = drawingStyle;
    // Some drawing tool buttons (Paint Fill/Stroke) listen for this so they can re-render.
    this.dispatchEvent(new DrawingStyleChangedEvent({...drawingStyle}, oldDrawingStyle));
  }

  /**
   * Switches the current document of the Editor to a new document. It releases the current
   * document, which should be garbage-collected.
   */
  switchDocument(doc: CarveDocument) {
    if (doc !== this.currentDoc) {
      this.currentDoc = doc;
      this.currentSelection.clear();

      // Clear out previous SVG doc and the overlay layer.
      while (this.topSVGElem.hasChildNodes()) {
        this.topSVGElem.removeChild(this.topSVGElem.firstChild);
      }
      this.overlayElem.innerHTML = '';

      const svgDom = this.currentDoc.getSVG();
      this.topSVGElem.appendChild(svgDom);
      if (svgDom.hasAttribute('viewBox')) {
        this.viewBox = Box.fromViewBoxString(svgDom.getAttribute('viewBox'));
      } else {
        console.error(`cannot handle an SVG image without a viewBox yet`);
      }

      this.resizeWorkArea();
    }
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
          height: calc(100% - 3em);
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

  
  /** Registers a tool to handle a given action. */
  private registerToolForAction(action: string, tool: Tool) {
    if (this.toolActionRegistry.has(action)) {
      throw `Already registered a tool to handle action '${action}`;
    }
    this.toolActionRegistry.set(action, tool);
    console.log(`Registered ${tool.constructor.name} for action ${action}`)
  }

  private resizeWorkArea() {
    const vbstr = this.viewBox.toString();
    this.backgroundElem.setAttribute('viewBox', vbstr);
    this.topSVGElem.setAttribute('viewBox', vbstr);
    this.overlayElem.setAttribute('viewBox', vbstr);
  }
}

customElements.define('carve-editor', CarveEditor);
