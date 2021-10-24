import { EditorHost } from '../editor-host.js';
import { SimpleActionTool } from './tool.js'
import { ToolbarButton } from '../toolbar-button.js';
import { DEFAULT_DRAWING_STYLE, DrawingStyleChangedEvent } from '../drawing-style.js';
import { ChangeAttributeCommand } from '../commands/change-attribute-command.js';

export const ACTION_PAINT_FILL = 'paint_fill';

/**
 * A tool that lets the user change the editor's fill paint.
 */
export class PaintFillTool extends SimpleActionTool {
  constructor(host: EditorHost) {
    super(host, { active: false, disabled: false});
  }

  getActions(): string[] { return [ ACTION_PAINT_FILL ]; }

  /**
   * Gets the fill color from the user, sets the editor to the new paint value and updates the
   * fill of any selected elements.
   */
  async onDo(action: string) {
    const fillColor = prompt(`What fill color?`);
    // TODO: Match it to rgb, rrggbb, rgba, rrggbbaa, a color name or something?
    const drawingStyle = this.host.getDrawingStyle();
    drawingStyle.fill = fillColor;
    this.host.setDrawingStyle(drawingStyle);
    const selection = this.host.getSelection();
    // TODO: Expand this once Batch Command has been implemented.
    if (selection.elements().length === 1) {
      const elem = selection.elements()[0];
      const oldFill = elem.getAttribute('fill');
      elem.setAttribute('fill', fillColor);
      this.host.commandExecute(new ChangeAttributeCommand(elem, 'fill', oldFill, fillColor));
    }
    console.log(`PaintFillTool: Changed the fill color to ${fillColor}`);
  }
}

/**
 * When the editor's drawing style changes, the button re-renders itself.
 */
export class PaintFillButton extends ToolbarButton {
  fillColor: string = DEFAULT_DRAWING_STYLE.fill;

  constructor(tool: SimpleActionTool) {
    super(tool);
    tool.getHost().addEventListener(DrawingStyleChangedEvent.TYPE,
      (evt: DrawingStyleChangedEvent) => {
        this.fillColor = evt.newDrawingStyle.fill;
        this.render();
      });
  }
  getAction(): string { return ACTION_PAINT_FILL; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#000000" color="${this.fillColor}">
    <g transform="translate(4, 2)">
      <path fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10"
          d="M9.6,20.4l-5.1-5.1c-0.8-0.8-0.8-2,0-2.8L11,6.2 l6.4,6.4c0.8,0.8,0.8,2,0,2.8l-5.1,5.1C11.6,21.2,10.4,21.2,9.6,20.4z"></path>
      <path fill="#000" d="M22,20c0,1.1-0.9,2-2,2s-2-0.9-2-2s2-4,2-4S22,18.9,22,20z"></path>
      <path fill="#000" d="M4,14c0,0.5,0.2,1,0.5,1.4l5.1,5.1c0.8,0.8,2,0.8,2.8,0l5.1-5.1C17.8,15,18,14.5,18,14H4z"></path>
      <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="7.5" y1="2.7" x2="15.4" y2="10.6"></line>
    </g>
    <line id="current" fill="none" stroke="currentColor" stroke-width="4" stroke-miterlimit="10" x1="2" y1="28" x2="28" y2="28"></line>
  </svg>`;
  }
}
