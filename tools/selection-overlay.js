import { SVGNS } from '../constants.js';
const OVERLAY_ID = 'selectorGroup';
/**
 * This handles the creation and maintenance of the selection overlay UI
 * (border, grippers, etc).
 */
export class SelectionOverlay {
    host;
    overlayGroup;
    constructor(host, toolId) {
        this.host = host;
        const id = `${OVERLAY_ID}${toolId}`;
        let overlayShouldNotExist = this.host.getOverlay().querySelector(`#${id}`);
        if (overlayShouldNotExist) {
            throw `Error: Overlay elements already existed for instance ${toolId}`;
        }
        // Now create the UI.
        this.initUI(toolId);
    }
    initUI(id) {
        this.overlayGroup = document.createElementNS(SVGNS, 'g');
        this.overlayGroup.id = id;
        this.overlayGroup.innerHTML = `<rect id="selectorBox" fill="none" stroke="#08f"
        stroke-width="1" stroke-dasharray="1" x="0" y="0" width="1" height="1" />`;
        this.overlayGroup.style.display = 'none';
        this.host.getOverlay().appendChild(this.overlayGroup);
    }
    hide() { this.overlayGroup.style.display = 'none'; }
    isShown() { return this.overlayGroup.style.display === 'block'; }
    show() { this.overlayGroup.style.display = 'block'; }
    /**
     * Updates the overlay UI elements to match the new parameters.
     */
    update(params) {
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
//# sourceMappingURL=selection-overlay.js.map