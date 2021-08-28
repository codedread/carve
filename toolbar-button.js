import { ToolStateChangedEvent, TOOL_STATE_CHANGED_EVENT_TYPE } from './tools/tool.js';
export const TOOLBAR_BUTTON_CLICKED_EVENT_TYPE = 'carve-toolbar-button-clicked';
/** Event for when the toolbar button is clicked. */
export class ToolbarClickedEvent extends Event {
    constructor(action) {
        super(TOOLBAR_BUTTON_CLICKED_EVENT_TYPE, { bubbles: true });
        this.action = action;
    }
}
/** A super-type for a toolbar button that can be clicked. */
export class ToolbarButton extends HTMLElement {
    constructor(tool) {
        super();
        this.tool = tool;
    }
    // Subclasses need to implement these.
    getAction() { throw `No getAction() impl in ToolbarButton sub-class`; }
    getButtonDOM() { throw `No getButtonDom() impl in ToolbarButton sub-class`; }
    getButtonStyle() {
        return `button.tool-bar-button {
      background-color: lightgrey;
      border-style: outset;
      border-width: 1px;
      height: 3em;
      margin: 2px 0 0 2px;
      padding: 0;
      width: 3em;
    }
    button.tool-bar-button:active {
      background-color: #c5c5c5;
      border-style: inset;
    }`;
    }
    connectedCallback() {
        this.render();
        this.addEventListener('click', this);
    }
    handleEvent(evt) {
        if (evt.type === 'click') {
            this.dispatchEvent(new ToolbarClickedEvent(this.getAction()));
        }
    }
    render() {
        this.attachShadow({ mode: 'open' }).innerHTML =
            `<style>${this.getButtonStyle()}</style>
        <button class="tool-bar-button">${this.getButtonDOM()}</button>`;
    }
}
/** A toolbar button that can be "active". Only one ToolbarModeButton can  be active at a time. */
export class ToolbarModeButton extends ToolbarButton {
    constructor(tool) {
        super(tool);
        tool.addEventListener(TOOL_STATE_CHANGED_EVENT_TYPE, this);
    }
    /** Reflect DOM attributes with JS state. */
    get active() { return this.hasAttribute('active'); }
    set active(val) {
        if (val) {
            this.setAttribute('active', '');
        }
        else {
            this.removeAttribute('active');
        }
    }
    getButtonStyle() {
        return `:host([active]) button {
      background-color: darkgrey;
      border-style: inset;
    }
    ${super.getButtonStyle()}`;
    }
    handleEvent(evt) {
        if (evt instanceof ToolStateChangedEvent) {
            if (this.active !== evt.newState.active) {
                this.active = evt.newState.active;
            }
            // TODO: enabled.
        }
        else {
            // Let base class handle mouse events.
            super.handleEvent(evt);
        }
    }
}
//# sourceMappingURL=toolbar-button.js.map