import { Tool, ToolState, ToolStateChangedEvent, TOOL_STATE_CHANGED_EVENT_TYPE } from './tools/tool.js';

export const TOOLBAR_BUTTON_CLICKED_EVENT_TYPE = 'carve-toolbar-button-clicked';

/** Event for when the toolbar button is clicked. */
export class ToolbarClickedEvent extends Event {
  constructor(public action: string) {
    super(TOOLBAR_BUTTON_CLICKED_EVENT_TYPE, { bubbles: true });
  }
}

/** A super-type for a toolbar button that can be clicked. */
export class ToolbarButton extends HTMLElement {
  constructor(protected tool: Tool) {
    super();
    this.disabled = tool.getState().disabled;
    tool.addEventListener(TOOL_STATE_CHANGED_EVENT_TYPE, this);
  }

  // Subclasses need to implement these.
  getAction(): string { throw `No getAction() impl in ToolbarButton sub-class`; }
  getButtonDOM(): string { throw `No getButtonDom() impl in ToolbarButton sub-class`; }

  protected getButtonStyle(): string {
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

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) {
    const buttonEl = this.shadowRoot && this.shadowRoot.querySelector('button.tool-bar-button');
    if (val) {
      this.setAttribute('disabled', '');
      if (buttonEl) {
        buttonEl.setAttribute('disabled', '');
      }
    } else {
      this.removeAttribute('disabled')
      if (buttonEl) {
        buttonEl.removeAttribute('disabled');
      }
    }
  }

  handleEvent(evt: Event) {
    if (evt instanceof ToolStateChangedEvent) {
      if (this.disabled !== evt.newState.disabled) {
        this.disabled = evt.newState.disabled;
      }
    } else if (evt.type === 'click') {
      if (!this.disabled) {
        this.dispatchEvent(new ToolbarClickedEvent(this.getAction()));
      } else {
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
    const shadowRoot = this.shadowRoot || this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `<style>${this.getButtonStyle()}</style>${buttonTag}`;
  }
}

/** A toolbar button that can be "active". Only one ToolbarModeButton can  be active at a time. */
export abstract class ToolbarModeButton extends ToolbarButton {
  constructor(tool: Tool) {
    super(tool);
    this.active = tool.getState().active;
  }

  /** Reflect DOM attributes with JS state. */
  get active(): boolean { return this.hasAttribute('active'); }
  set active(val: boolean) {
    if (val) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  protected getButtonStyle(): string {
    return `:host([active]) button:enabled {
      background-color: darkgrey;
      border-style: inset;
    }
    ${super.getButtonStyle()}`;
  }

  handleEvent(evt: Event) {
    if (evt instanceof ToolStateChangedEvent) {
      if (this.active !== evt.newState.active) {
        this.active = evt.newState.active;
      }
    }
    // Let base class handle mouse events.
    super.handleEvent(evt);
  }
}