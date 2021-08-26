import { CarveAction } from './actions.js';
import { ToolbarModeButton } from './toolbar-button.js';

export class CarveRectangleButton extends ToolbarModeButton {
  getAction(): CarveAction { return CarveAction.RECTANGLE_MODE; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Rectangle Tool</title>
      <rect x="15" y="30" width="70" height="40" fill="red" stroke-width="4" stroke="black" />
    </svg>`;
  }
}

export class CarveEllipseButton extends ToolbarModeButton {
  getAction(): CarveAction { return CarveAction.ELLIPSE_MODE; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Rectangle Tool</title>
      <ellipse cx="50" cy="50" rx="40" ry="20" fill="green" stroke-width="4" stroke="black" />
    </svg>`;
  }
}
