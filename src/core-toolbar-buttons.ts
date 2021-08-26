import { CarveAction } from './actions.js';
import { ToolbarModeButton } from './toolbar-button.js';

export class CarveEllipseButton extends ToolbarModeButton {
  getAction(): CarveAction { return CarveAction.ELLIPSE_MODE; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Ellipse Tool</title>
      <ellipse cx="50" cy="50" rx="40" ry="20" fill="green" stroke-width="4" stroke="black" />
    </svg>`;
  }
}
