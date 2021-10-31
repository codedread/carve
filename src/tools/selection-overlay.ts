import { SVGNS } from '../constants.js';
import { EditorHost } from '../editor-host.js';
import { Matrix } from '../math/matrix.js';

const OVERLAY_ID = 'selectorGroup';

export interface SelectionOverlayParameters {
  /** Transform of the entire selection overlay UI. */
  transform?: Matrix;
  /** Left edge of the selection rectangle. */
  x?: number,
  /** Top edge of the selection rectangle. */
  y?: number,
  /** Width of the selection rectangle. */
  width?: number,
  /** Height of the selection rectangle. */
  height?: number,
  /** Stroke width of the selection rectangle. */
  strokeWidth?: number,
  /** Stroke dash array of the selection rectangle. */
  strokeDashArray?: Number;
}

/**
 * This handles the creation and maintenance of the selection overlay UI
 * (border, grippers, etc).
 */
export class SelectionOverlay {
  private overlayGroup: SVGGElement

  constructor(private host: EditorHost, toolId: string) {
    const id = `${OVERLAY_ID}${toolId}`;
    let overlayShouldNotExist = this.host.getOverlay().querySelector(`#${id}`);
    if (overlayShouldNotExist) {
      throw `Error: Overlay elements already existed for instance ${toolId}`;
    }

    // Now create the UI.
    this.initUI(toolId);
  }

  private initUI(id: string) {
    this.overlayGroup = document.createElementNS(SVGNS, 'g');
    this.overlayGroup.id = id;
    this.overlayGroup.innerHTML = `<rect id="selectorBox" fill="none" stroke="#08f"
        stroke-width="1" stroke-dasharray="1" x="0" y="0" width="1" height="1" />`;
    this.overlayGroup.style.display = 'none';
    this.host.getOverlay().appendChild(this.overlayGroup);
  }

  hide() { this.overlayGroup.style.display = 'none'; }
  isShown(): boolean { return this.overlayGroup.style.display === 'block'; }
  show() { this.overlayGroup.style.display = 'block'; }

  /**
   * Updates the overlay UI elements to match the new parameters.
   */
  update(params: SelectionOverlayParameters) {
    this.overlayGroup.style.display = 'none';

    if (params.transform) {
      this.overlayGroup.setAttribute('transform', params.transform.toTransformString());
    }

    const rect = this.overlayGroup.querySelector('#selectorBox');
    if (params.x) {
      rect.setAttribute('x', `${params.x}`);
    }
    if (params.y) {
      rect.setAttribute('y', `${params.y}`);
    }
    if (params.width) {
      rect.setAttribute('width', `${params.width}`);
    }
    if (params.height) {
      rect.setAttribute('height', `${params.height}`);
    }
    if (params.strokeWidth) {
      rect.setAttribute('stroke-width', `${params.strokeWidth}`);
    }
    if (params.strokeDashArray) {
      rect.setAttribute('stroke-dasharray', `${params.strokeDashArray}`);
    }

    this.overlayGroup.style.display = 'block';
  }
}
