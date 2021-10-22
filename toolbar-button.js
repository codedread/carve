import { ToolStateChangedEvent } from './tools/tool.js';
/** Event for when the toolbar button is clicked. */
export class ToolbarClickedEvent extends Event {
    action;
    static TYPE = 'carve-toolbar-button-clicked';
    constructor(action) {
        super(ToolbarClickedEvent.TYPE, { bubbles: true });
        this.action = action;
    }
}
/** A super-type for a toolbar button that can be clicked. */
export class ToolbarButton extends HTMLElement {
    tool;
    constructor(tool) {
        super();
        this.tool = tool;
        this.disabled = tool.getState().disabled;
        tool.addEventListener(ToolStateChangedEvent.TYPE, this);
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
    }
    button.tool-bar-button:disabled {
      background-color: lightgrey;
      border-style: outset;
      opacity: 0.5;
    }`;
    }
    connectedCallback() {
        this.render();
        this.addEventListener('click', this);
    }
    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(val) {
        const buttonEl = this.shadowRoot && this.shadowRoot.querySelector('button.tool-bar-button');
        if (val) {
            this.setAttribute('disabled', '');
            if (buttonEl) {
                buttonEl.setAttribute('disabled', '');
            }
        }
        else {
            this.removeAttribute('disabled');
            if (buttonEl) {
                buttonEl.removeAttribute('disabled');
            }
        }
    }
    handleEvent(evt) {
        if (evt instanceof ToolStateChangedEvent) {
            if (this.disabled !== evt.newState.disabled) {
                this.disabled = evt.newState.disabled;
            }
        }
        else if (evt.type === 'click') {
            if (!this.disabled) {
                this.dispatchEvent(new ToolbarClickedEvent(this.getAction()));
            }
            else {
                evt.stopPropagation();
                evt.preventDefault();
            }
        }
    }
    render() {
        let buttonTag = `<button class="tool-bar-button"`;
        if (this.tool.isDisabled()) {
            buttonTag += ` disabled`;
        }
        buttonTag += `>${this.getButtonDOM()}</button>`;
        // Use existing shadow root, if it exists (from a previous render).
        const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `<style>${this.getButtonStyle()}</style>${buttonTag}`;
    }
}
/** A toolbar button that can be "active". Only one ToolbarModeButton can  be active at a time. */
export class ToolbarModeButton extends ToolbarButton {
    constructor(tool) {
        super(tool);
        this.active = tool.getState().active;
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
        return `:host([active]) button:enabled {
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
        }
        // Let base class handle mouse events.
        super.handleEvent(evt);
    }
}
//# sourceMappingURL=toolbar-button.js.map