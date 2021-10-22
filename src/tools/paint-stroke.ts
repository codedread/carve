import { EditorHost } from '../editor-host.js';
import { SimpleActionTool } from './tool.js'
import { ToolbarButton } from '../toolbar-button.js';
import { DEFAULT_DRAWING_STYLE, DrawingStyleChangedEvent } from '../drawing-style.js';
import { ChangeAttributeCommand } from '../commands/change-attribute-command.js';

export const ACTION_PAINT_STROKE = 'paint_stroke';

/**
 * A tool that lets the user change the editor's stroke paint.
 */
export class PaintStrokeTool extends SimpleActionTool {
  constructor(host: EditorHost) {
    super(host, { active: false, disabled: false});
  }

  getActions(): string[] { return [ ACTION_PAINT_STROKE ]; }

  /**
   * Gets the stroke color from the user, sets the editor to the new paint value and updates the
   * stroke of any selected elements.
   */
  async onDo() {
    const strokeColor = prompt(`What stroke color?`);
    // TODO: Match it to rgb, rrggbb, rgba, rrggbbaa, a color name or something?
    const drawingStyle = this.host.getDrawingStyle();
    drawingStyle.stroke = strokeColor;
    this.host.setDrawingStyle(drawingStyle);
    const selection = this.host.getSelection();
    // TODO: Expand this once Batch Command has been implemented.
    if (selection.elements().length === 1) {
      const elem = selection.elements()[0];
      const oldStroke = elem.getAttribute('stroke');
      elem.setAttribute('stroke', strokeColor);
      this.host.commandExecute(new ChangeAttributeCommand(elem, 'stroke', oldStroke, strokeColor));
    }
    console.log(`PaintStrokeTool: Changed the stroke color to ${strokeColor}`);
  }
}

/**
 * When the editor's drawing style changes, the button re-renders itself.
 */
export class PaintStrokeButton extends ToolbarButton {
  strokeColor: string = DEFAULT_DRAWING_STYLE.stroke;

  constructor(tool: SimpleActionTool) {
    super(tool);
    tool.getHost().addEventListener(DrawingStyleChangedEvent.TYPE,
      (evt: DrawingStyleChangedEvent) => {
        this.strokeColor = evt.newDrawingStyle.stroke;
        this.render();
      });
  }
  getAction(): string { return ACTION_PAINT_STROKE; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="#000000" color="${this.strokeColor}">
    <path d="m96.846 9.12l-6.319-6.311c-1.814-1.811-4.226-2.809-6.792-2.809-2.564 0-4.977 0.998-6.79 2.809l-6.319 6.311c-0.093 0.092-0.145 0.216-0.145 0.347 0 0.13 0.052 0.254 0.145 0.346l19.207 19.182c0.092 0.092 0.218 0.144 0.348 0.144 0.131 0 0.255-0.052 0.346-0.144l6.319-6.311c1.814-1.812 2.813-4.22 2.813-6.783 0-2.561-0.999-4.969-2.813-6.781z" transform="matrix(1,0,0,1,34.98310475054659,12.403100775193801)"/>
    <path d="m69.172 11.265c-0.191-0.192-0.502-0.192-0.695 0l-56.838 56.764c-0.192 0.191-0.192 0.501 0 0.692l19.207 19.184c0.096 0.095 0.222 0.143 0.348 0.143 0.125 0 0.251-0.048 0.347-0.143l56.839-56.765c0.093-0.092 0.145-0.216 0.145-0.347s-0.052-0.255-0.145-0.347l-19.208-19.181z" transform="matrix(1,0,0,1,31.166766050486988,16.85549592526337)"/>
    <path d="m10.358 69.967c-0.122-0.121-0.296-0.172-0.464-0.129-0.167 0.04-0.3 0.165-0.351 0.33l-9.18 29.195c-0.055 0.178-0.006 0.369 0.127 0.498 0.094 0.091 0.217 0.139 0.342 0.139 0.054 0 0.11-0.011 0.164-0.029l28.387-10.012c0.159-0.056 0.278-0.188 0.315-0.354 0.037-0.164-0.012-0.337-0.132-0.455l-19.208-19.183z" transform="matrix(1,0,0,1,33.07493591308594,14.947325931489171)"/>
    <line id="current" fill="none" stroke="currentColor" stroke-width="20" stroke-miterlimit="10" x1="10" y1="140" x2="140" y2="140"/>
  </svg>`;
  }
}
