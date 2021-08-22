import { CarveAction } from './actions.js';
import { ToolbarButton, ToolbarModeButton } from './toolbar-button.js';

export class CarveNewButton extends ToolbarButton {
  getAction(): CarveAction { return CarveAction.NEW_DOCUMENT; }
  getButtonDOM(): string {
    return `<span>N</span>`;
  }
}

export class CarveOpenButton extends ToolbarButton {
  getAction(): CarveAction { return CarveAction.OPEN_DOCUMENT; }
  getButtonDOM(): string {
    return `<span>O</span>`;
  }
}

export class CarveRectangleButton extends ToolbarModeButton {
  getAction(): CarveAction { return CarveAction.RECTANGLE_MODE; }
  getButtonDOM(): string {
    return `<span>R</span>`;
  }
}
