import { SimpleActionTool } from './tool.js';
import { ToolbarModeButton } from '../toolbar-button.js';
import { COMMAND_STATE_CHANGED_EVENT_TYPE } from '../history.js';
export const ACTION_UNDO = 'undo';
/**
 * A tool that undoes the last command. It enables itself if the pointer in the command stack is
 * not at the top of the stack.
 */
export class UndoTool extends SimpleActionTool {
    constructor(host) {
        super(host, { active: false, disabled: true });
        this.host.addEventListener(COMMAND_STATE_CHANGED_EVENT_TYPE, (evt) => {
            this.setDisabled(evt.commandIndex === 0);
        });
    }
    getActions() { return [ACTION_UNDO]; }
    async onDo() {
        // TODO: Unit test that this is called.
        this.host.getSelection().clear();
        this.host.commandUnexecute();
    }
}
export class UndoButton extends ToolbarModeButton {
    getAction() { return ACTION_UNDO; }
    getButtonDOM() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -80 640 640">
      <title>Undo Tool</title>
      <path d="m386.56442,386.01894c39.50308,-54.12826 65.07683,-170.44355 -29.07347,-226.07129c-94.1503,-55.62773 -186.57429,19.48065 -219.49096,79.42061" fill="#000000" fill-opacity="0" id="svg_1" stroke="#000000" stroke-width="80"/>
      <path d="m218.16667,313.5c-54,11.66667 -110,25.33333 -164,37l-0.83333,-194.5l164.83333,157.5z" fill="#000000" id="svg_3" stroke="#000000" stroke-dasharray="null" stroke-linecap="null" stroke-linejoin="null" stroke-width="40"/>
    </svg>`;
    }
}
//# sourceMappingURL=undo.js.map