import { Tool, ToolStateChangedEvent, TOOL_STATE_CHANGED_EVENT_TYPE } from './tools/tool.js';

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
    }`;
  }

  connectedCallback() {
    this.render();
    this.addEventListener('click', this);
  }

  handleEvent(evt: Event) {
    if (evt.type === 'click') {
      this.dispatchEvent(new ToolbarClickedEvent(this.getAction()));
    }
  }

  render() {
    this.attachShadow({mode: 'open'}).innerHTML =
        `<style>${this.getButtonStyle()}</style>
        <button class="tool-bar-button">${this.getButtonDOM()}</button>`;
  }
}

/** A toolbar button that can be "active". Only one ToolbarModeButton can  be active at a time. */
export abstract class ToolbarModeButton extends ToolbarButton {
  constructor(tool: Tool) {
    super(tool);
    tool.addEventListener(TOOL_STATE_CHANGED_EVENT_TYPE, this);
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
    return `:host([active]) button {
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
      // TODO: enabled.
    } else {
      // Let base class handle mouse events.
      super.handleEvent(evt);
    }
  }
}