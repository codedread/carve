import { CarveMouseEvent } from '../carve-mouse-event.js';
import { ModeTool } from './tool.js';
import { ToolbarModeButton } from '../toolbar-button.js';

export const ACTION_SELECT_MODE = 'select_mode';

export class SimpleSelectTool extends ModeTool {
  private mousedDownElem: SVGElement = null;

  getActions(): string[] { return [ ACTION_SELECT_MODE ]; }

  onMouseDown(evt: CarveMouseEvent) {
    const image = this.host.getImage();
    // If the moused-upon element has the image as an ancestor, remember it.
    let node = evt.mouseEvent.target as Element;
    while (node) {
      if (node.parentElement as Element === image) {
        this.mousedDownElem = evt.mouseEvent.target as SVGElement;
      }
      node = node.parentElement;
    }
  }

  onMouseUp(evt: CarveMouseEvent) {
    const mousedUpElem = evt.mouseEvent.target as SVGGraphicsElement;
    if (mousedUpElem === this.mousedDownElem) {
      this.host.getSelection().set([mousedUpElem]);

      // Add something to the overlay layer.
      const overlay = this.host.getOverlay();
      overlay.innerHTML = `<g id="selectorGroup">
        <rect id="selectorBox" fill="none" stroke="#08f" stroke-width="1px" stroke-dasharray="1,1" />
      </g>`;

      const bbox = this.host.getSelection().getBBox();
      const selectorBoxEl = overlay.querySelector('#selectorBox');
      selectorBoxEl.setAttribute('x', `${bbox.x}`);
      selectorBoxEl.setAttribute('y', `${bbox.y}`);
      selectorBoxEl.setAttribute('width', `${bbox.w}`);
      selectorBoxEl.setAttribute('height', `${bbox.h}`);
    } else {
      this.host.getSelection().clear();
      this.host.getOverlay().innerHTML = '';
    }
    this.mousedDownElem = null;
  }

  onMouseMove(evt: CarveMouseEvent) {}
}

export class SimpleSelectButton extends ToolbarModeButton {
  getAction(): string { return ACTION_SELECT_MODE; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <title>Select Tool</title>
        <path d="M50,15 l20,35 l-16,-3 v35 h-8 v-35 l-16,3 z" transform="rotate(-45,50,50)"
              fill="white" stroke="black" stroke-width="3" />
      </svg>`;
  }
}
