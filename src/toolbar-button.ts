export const TOOLBAR_BUTTON_CLICKED_EVENT_TYPE = 'carve-toolbar-button-clicked';

/** Event for when the toolbar button is clicked. */
export class ToolbarClickedEvent extends Event {
  constructor(public action: string) {
    super(TOOLBAR_BUTTON_CLICKED_EVENT_TYPE, { bubbles: true });
  }
}

/** A super-type for a toolbar button that can be clicked. */
export abstract class ToolbarButton extends HTMLElement {
  constructor() {
    super();
  }

  abstract getAction(): string;
  abstract getButtonDOM(): string;

  protected getButtonStyle(): string {
    return `button {
      background-color: lightgrey;
      border-style: outset;
      border-width: 1px;
      height: 3em;
      margin: 2px 0 0 2px;
      padding: 0;
      width: 3em;
    }
    button:active {
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
        <button>${this.getButtonDOM()}</button>`;
  }
}

/** A toolbar button that can be "active". Only one ToolbarModeButton can  be active at a time. */
export abstract class ToolbarModeButton extends ToolbarButton {
  constructor() {
    super();

    // Add all mode buttons to a static list.
    if (!ToolbarModeButton.allModeButtons.includes(this)) {
      ToolbarModeButton.allModeButtons.push(this);
    }
  }

  /** Reflect DOM attributes with JS state. */
  get active(): boolean { return this.hasAttribute('active'); }
  set active(val: boolean) {
    if (val) {
      this.setAttribute('active', '');
      // Loop over all other buttons and set their active to false.
      for (const modeButton of ToolbarModeButton.allModeButtons) {
        if (modeButton !== this) {
          modeButton.active = false;
        }
      }
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
    super.handleEvent(evt);
    // A click activates this button.
    this.active = true;
  }

  static allModeButtons = [];
}