import { createDocumentFromFile } from '../document/document.js';
import { CommandStateChangedEvent, COMMAND_STATE_CHANGED_EVENT_TYPE } from '../history.js';
import { EditorHost } from '../editor-host.js';
import { FileSystemFileHandle } from '../types/filesystem.js';
import { SimpleActionTool } from './tool.js'
import { ToolbarButton } from '../toolbar-button.js';

export const ACTION_SAVE_DOCUMENT_AS = 'save_document_as';

/** A tool that saves a document to a file. */
export class FileSaveAsTool extends SimpleActionTool {
  constructor(host: EditorHost) {
    super(host, { active: false, disabled: true});
    this.host.addEventListener(COMMAND_STATE_CHANGED_EVENT_TYPE, (evt: CommandStateChangedEvent) => {
      this.setDisabled(evt.commandIndex === 0);
    });
  }
  getActions(): string[] { return [ ACTION_SAVE_DOCUMENT_AS ]; }

  async onDo() {
    if (window['showSaveFilePicker']) {
      try {
        const fileHandle: FileSystemFileHandle = await window['showSaveFilePicker']({
          types: [
            {
              description: 'SVG files',
              accept: { 'image/svg+xml': ['.svg'] },
            },
          ],
        });
        const writableStream = await fileHandle.createWritable();
        const svgText = new XMLSerializer().serializeToString(this.host.getOutputImage());
        await writableStream.write(svgText);
        await writableStream.close();
      } catch (err) {
        alert(err);
      }
    }
    // Else, do the old file picker input thing.
  }
}

export class FileSaveAsButton extends ToolbarButton {
  getAction(): string { return ACTION_SAVE_DOCUMENT_AS; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150">
    <title>Save Document As</title>
    <g id="floppy" stroke="black" stroke-width="1" stroke-linejoin="bevel" fill="purple">
      <rect x="35" y="35" width="80" height="80" rx="5" ry="5" />
      <rect x="40" y="37" width="70" height="50" fill="white" />
      <line x1="45" y1="45" x2="105" y2="45" stroke-width="0.5" stroke="black" />
      <line x1="45" y1="57" x2="105" y2="57" stroke-width="0.5" stroke="black" />
      <line x1="45" y1="69" x2="105" y2="69" stroke-width="0.5" stroke="black" />
      <line x1="45" y1="84" x2="105" y2="84" stroke-width="0.5" stroke="black" />
      <rect x="50" y="92" width="50" height="23" fill="grey" />
      <rect x="55" y="95" width="12" height="17" />
    </g>
    <g id="pencil">
      <path d="M130,125 l-50,-50 l-15,-5 l5,15 l50,50 z" fill="orange" stroke="black" stroke-width="2" />
    </g>
  </svg>`;
  }
}
