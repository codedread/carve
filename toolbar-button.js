export const TOOLBAR_CLICKED_TYPE = 'toolbar-clicked';
/** Event for when the toolbar button is clicked. */
export class ToolbarClickedEvent extends Event {
    constructor(action) {
        super(TOOLBAR_CLICKED_TYPE, { bubbles: true });
        this.action = action;
    }
}
/** A super-type for toolbar buttons. */
export class ToolbarButton extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
        this.addEventListener('click', () => this.dispatchEvent(new ToolbarClickedEvent(this.getAction())));
    }
    render() {
        this.attachShadow({ mode: 'open' }).innerHTML = `<button>${this.getButtonDOM()}</button>`;
    }
}
//# sourceMappingURL=toolbar-button.js.map