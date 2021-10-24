import { createDocumentFromFile } from '../document/document.js';
import { SimpleActionTool } from './tool.js';
import { ToolbarButton } from '../toolbar-button.js';
export const ACTION_OPEN_DOCUMENT = 'open_document';
/** A tool that opens a document from a file. */
export class FileOpenTool extends SimpleActionTool {
    constructor(host) {
        super(host, { active: false, disabled: !window['showOpenFilePicker'] });
    }
    getActions() { return [ACTION_OPEN_DOCUMENT]; }
    async onDo(action) {
        if (!this.isDisabled()) {
            try {
                const handleArray = await window['showOpenFilePicker']({
                    multiple: false,
                    types: [
                        {
                            description: 'SVG files',
                            // Add svgz to the accept extensions?
                            accept: { 'image/svg+xml': ['.svg'] },
                        },
                    ],
                });
                this.host.switchDocument(await createDocumentFromFile(handleArray[0]));
            }
            catch (err) {
                console.log(`File open tool: ${err}`);
            }
        }
        // Else, do the old file picker input thing.
    }
}
export class FileOpenButton extends ToolbarButton {
    getAction() { return ACTION_OPEN_DOCUMENT; }
    getButtonDOM() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Open Document</title>
      <g stroke="black" stroke-width="1" stroke-linejoin="bevel">
        <path d="M7.5,20 h25 v10 h55 v15 h-70 l-10,45 z" fill="#F8D775" />
        <path d="M20,47.5 h75 l-20,45 h-65 z" fill="#FFE9A2" />
        <path d="M47.5,5 l17.5,17.5 h-7.5 v20 h-20 v-20 h-7.5 z" fill="green" />
      </g>
    </svg>`;
    }
}
//# sourceMappingURL=file-open.js.map