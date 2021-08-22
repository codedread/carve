import { CarveAction } from './actions.js';

export const TOOLBAR_CLICKED_TYPE = 'toolbar-clicked';

/** Event for when the toolbar button is clicked. */
export class ToolbarClickedEvent extends Event {
  constructor(public action: CarveAction) {
    super(TOOLBAR_CLICKED_TYPE, { bubbles: true });
  }
}

/** A super-type for toolbar buttons. */
export abstract class ToolbarButton extends HTMLElement {
  constructor() {
    super();
  }

  abstract getAction(): CarveAction;
  abstract getButtonDOM(): string;

  connectedCallback() {
    this.render();
    this.addEventListener(
        'click',
        () => this.dispatchEvent(new ToolbarClickedEvent(this.getAction())));
  }

  render() {
    this.attachShadow({mode: 'open'}).innerHTML = `<button>${this.getButtonDOM()}</button>`;
  }
}
