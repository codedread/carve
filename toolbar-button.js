export const TOOLBAR_CLICKED_TYPE = 'toolbar-clicked';
/** Event for when the toolbar button is clicked. */
export class ToolbarClickedEvent extends Event {
    constructor(action) {
        super(TOOLBAR_CLICKED_TYPE, { bubbles: true });
        this.action = action;
    }
}
/** A super-type for a toolbar button that can be clicked. */
export class ToolbarButton extends HTMLElement {
    constructor() {
        super();
    }
    getButtonStyle() {
        return `button {
      border-width: 2px;
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
        <button>${this.getButtonDOM()}</button>`;
    }
}
/** A toolbar button that can be "active". Only one ToolbarModeButton can  be active at a time. */
export class ToolbarModeButton extends ToolbarButton {
    constructor() {
        super();
        // Add all mode buttons to a static list.
        if (!ToolbarModeButton.allModeButtons.includes(this)) {
            ToolbarModeButton.allModeButtons.push(this);
        }
    }
    /** Reflect DOM attributes with JS state. */
    get active() { return this.hasAttribute('active'); }
    set active(val) {
        if (val) {
            this.setAttribute('active', '');
            // Loop over all other buttons and set their active to false.
            for (const modeButton of ToolbarModeButton.allModeButtons) {
                if (modeButton !== this) {
                    modeButton.active = false;
                }
            }
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
        super.handleEvent(evt);
        // A click activates this button.
        this.active = true;
    }
}
ToolbarModeButton.allModeButtons = [];
//# sourceMappingURL=toolbar-button.js.map