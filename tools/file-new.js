import { createNewDocument } from '../document.js';
import { SimpleActionTool } from './tool.js';
import { ToolbarButton } from '../toolbar-button.js';
export const ACTION_NEW_DOCUMENT = 'new_document';
/** A tool that opens a new document. */
export class FileNewTool extends SimpleActionTool {
    getActions() { return [ACTION_NEW_DOCUMENT]; }
    async onDo() {
        this.host.switchDocument(await createNewDocument());
    }
}
export class FileNewButton extends ToolbarButton {
    getAction() { return ACTION_NEW_DOCUMENT; }
    getButtonDOM() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>New Document</title>
      <g stroke="black" stroke-width="1" stroke-linejoin="bevel">
        <path d="M20,5 h40 v20 h20 v70 h-60 z" fill="white" />
        <path d="M60,5 l20,20 h-20 z" fill="#ffffbf" />
      </g>
    </svg>`;
    }
}
//# sourceMappingURL=file-new.js.map