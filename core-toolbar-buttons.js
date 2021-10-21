import { CarveAction } from './actions.js';
import { ToolbarModeButton } from './toolbar-button.js';
export class CarveEllipseButton extends ToolbarModeButton {
    getAction() { return CarveAction.ELLIPSE_MODE; }
    getButtonDOM() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Ellipse Tool</title>
      <ellipse cx="50" cy="50" rx="40" ry="20" fill="green" stroke-width="4" stroke="black" />
    </svg>`;
    }
}
//# sourceMappingURL=core-toolbar-buttons.js.map