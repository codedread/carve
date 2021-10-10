import { DeleteElementsCommand } from '../commands/delete-elements-command.js';
import { SELECTION_EVENT_TYPE } from '../selection.js';
import { SimpleActionTool } from './tool.js';
import { ToolbarButton } from '../toolbar-button.js';
export const ACTION_DELETE = 'delete_selection';
/** A tool that deletes the currently selected elements from the document. */
export class DeleteTool extends SimpleActionTool {
    constructor(host) {
        super(host, { active: false, disabled: true });
        this.host.getSelection().addEventListener(SELECTION_EVENT_TYPE, (evt) => {
            this.setDisabled(evt.selectedElements.length === 0);
        });
    }
    getActions() { return [ACTION_DELETE]; }
    async onDo() {
        const selection = this.host.getSelection();
        if (selection.size() === 1) {
            const elem = selection.elements()[0];
            selection.clear();
            // Clear the selection bbox. TODO: Figure out a better way.
            this.host.getOverlay().innerHTML = '';
            this.host.commandExecute(new DeleteElementsCommand(elem));
            console.log(`DeleteTool: Deleted an element`);
        }
    }
}
export class DeleteButton extends ToolbarButton {
    getAction() { return ACTION_DELETE; }
    getButtonDOM() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Delete</title>
      <circle cx="50" cy="50" r="30" fill="red" />
      <path d="M35,35 l30,30 m0,-30 l-30,30" stroke="white" stroke-width="5" />
    </svg>`;
    }
}
//# sourceMappingURL=delete.js.map