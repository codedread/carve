import { Box } from './math/box.js';
import { createNewDocument } from './document.js';
import { toCarveMouseEvent } from './carve-mouse-event.js';
import { CommandStateChangedEvent } from './history.js';
import { Selection, SelectionEvent, SELECTION_EVENT_TYPE } from './selection.js';
import { SVGNS } from './constants.js';
import { ModeTool, SimpleActionTool } from './tools/tool.js';
import { ToolbarClickedEvent, TOOLBAR_BUTTON_CLICKED_EVENT_TYPE } from './toolbar-button.js';
const CARVE_TOP_DIV = 'carveTopDiv';
const CARVE_WORK_AREA = 'carveWorkArea';
const CARVE_BACKGROUND = 'carveBackground';
const CARVE_IMAGE = 'carveImage';
const CARVE_OVERLAY = 'carveOverlay';
/** The fraction of the Work Area that the canvas takes up. */
const L = 0.9;
/** The margin on either side of the canvas. */
const M = (1 - L) / 2;
/** A CarveEditor can open a CarveDocument into the work area. */
export class CarveEditor extends HTMLElement {
    currentDoc;
    workArea;
    backgroundElem;
    topSVGElem;
    overlayElem;
    viewBox = new Box();
    toolActionRegistry = new Map();
    keyActionRegistry = new Map();
    currentModeTool = null;
    currentSelection = new Selection();
    constructor() {
        super();
        this.createShadowDOM();
        // Listen for events.
        window.addEventListener('keyup', this);
        this.addEventListener(TOOLBAR_BUTTON_CLICKED_EVENT_TYPE, this);
        this.currentSelection.addEventListener(SELECTION_EVENT_TYPE, this);
        this.workArea.addEventListener('mousedown', this);
        this.workArea.addEventListener('mousemove', this);
        this.workArea.addEventListener('mouseup', this);
        // Create a new doc.
        createNewDocument().then(doc => this.switchDocument(doc));
    }
    /** Executes the command and broadcasts that the command stack state has changed. */
    commandExecute(cmd) {
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
    getImage() {
        return this.topSVGElem.firstElementChild;
    }
    getOverlay() {
        return this.overlayElem;
    }
    getSelection() {
        return this.currentSelection;
    }
    handleEvent(e) {
        // Some events trigger an action.
        let action;
        if (e instanceof KeyboardEvent && this.keyActionRegistry.has(e.key)) {
            action = this.keyActionRegistry.get(e.key);
        }
        else if (e instanceof ToolbarClickedEvent) {
            action = e.action;
        }
        else if (e instanceof SelectionEvent) {
            // TODO: This is a change in editor state.
            console.log(`Editor received a SelectionEvent`);
        }
        else if (e instanceof MouseEvent && this.currentModeTool) {
            const cme = toCarveMouseEvent(e, this.viewBox, parseInt(window.getComputedStyle(this.workArea)['width'], 10), parseInt(window.getComputedStyle(this.workArea)['height'], 10), L, M);
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
            console.log(`Editor translated an event into an Action: '${action}'`);
            const tool = this.toolActionRegistry.get(action);
            console.log(`Editor resolved action to tool '${tool.constructor.name}'`);
            if (tool && !tool.isDisabled()) {
                if (tool instanceof SimpleActionTool) {
                    tool.onDo();
                }
                else if (tool instanceof ModeTool) {
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
    /** Registers an Action with the Editor by its keystroke. */
    registerKeyBinding(key, action) {
        if (!this.toolActionRegistry.has(action)) {
            throw `Key binding attempted for action '${action} without a registered tool.`;
        }
        if (this.keyActionRegistry.has(key)) {
            throw `Key binding for '${key}' already bound to action '${action}'`;
        }
        this.keyActionRegistry.set(key, action);
        return this;
    }
    /**
     * Registers a tool with the Editor by its actions. Also registers any custom elements in the
     * custom elements map, binding them to the tool.
     */
    registerTool(ctor, customElementsMap = null) {
        const tool = new ctor(this);
        for (const action of tool.getActions()) {
            this.registerToolForAction(action, tool);
        }
        for (const [tagName, config] of Object.entries(customElementsMap)) {
            // Register an anonymous class that extends the passed-in constructor but encloses the
            // tool so that the UI element has a reference to the tool and can subscribe to its events.
            customElements.define(tagName, class extends config.ctor {
                constructor() { super(tool); }
            });
        }
        return this;
    }
    /**
     * Switches the current document of the Editor to a new document. It releases the current
     * document, which should be garbage-collected.
     */
    switchDocument(doc) {
        if (doc !== this.currentDoc) {
            // TODO: These are changes in editor state.
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
            }
            else {
                console.error(`cannot handle an SVG image without a viewBox yet`);
            }
            this.resizeWorkArea();
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
    /** Registers a tool to handle a given action. */
    registerToolForAction(action, tool) {
        if (this.toolActionRegistry.has(action)) {
            throw `Already registered a tool to handle action '${action}`;
        }
        this.toolActionRegistry.set(action, tool);
    }
    resizeWorkArea() {
        const vbstr = this.viewBox.toString();
        this.backgroundElem.setAttribute('viewBox', vbstr);
        this.topSVGElem.setAttribute('viewBox', vbstr);
        this.overlayElem.setAttribute('viewBox', vbstr);
    }
}
customElements.define('carve-editor', CarveEditor);
//# sourceMappingURL=editor.js.map