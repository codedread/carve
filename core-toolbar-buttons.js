import { CarveAction } from './actions.js';
import { ToolbarButton } from './toolbar-button.js';
export class CarveNewButton extends ToolbarButton {
    getAction() { return CarveAction.NEW_DOCUMENT; }
    getButtonDOM() {
        return `<span>N</span>`;
    }
}
export class CarveOpenButton extends ToolbarButton {
    getAction() { return CarveAction.OPEN_DOCUMENT; }
    getButtonDOM() {
        return `<span>O</span>`;
    }
}
//# sourceMappingURL=core-toolbar-buttons.js.map