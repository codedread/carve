import { CarveAction } from './actions.js';
import { createDocumentFromFile, createNewDocument } from './document.js';
import { keyToAction } from './keys.js';
import { ToolbarClickedEvent, TOOLBAR_CLICKED_TYPE } from './toolbar-button.js';
const CARVE_TOP_DIV = 'carveTopDiv';
const CARVE_WORK_AREA = 'carveWorkArea';
const CARVE_BACKGROUND = 'carveBackground';
const CARVE_IMAGE = 'carveImage';
const SVGNS = 'http://www.w3.org/2000/svg';
/**
 * A CarveEditor can open a CarveDocument into the work area.
 */
export class CarveEditor extends HTMLElement {
    constructor() {
        super();
        this.createShadowDOM();
        window.addEventListener('keyup', this);
        this.addEventListener(TOOLBAR_CLICKED_TYPE, this);
        createNewDocument().then(doc => this.switchDocument(doc));
    }
    handleEvent(e) {
        let action;
        if (e instanceof KeyboardEvent) {
            action = keyToAction(e.key);
        }
        else if (e instanceof ToolbarClickedEvent) {
            action = e.action;
        }
        switch (action) {
            case CarveAction.NEW_DOCUMENT:
                this.doNewDoc();
                break;
            case CarveAction.OPEN_DOCUMENT:
                this.doOpenDoc();
                break;
        }
    }
    createShadowDOM() {
        this.attachShadow({ mode: 'open' }).innerHTML = `
      <style type="text/css">
        #${CARVE_TOP_DIV} {
          position: relative;
          width: 100%;
          height: 100%;
        }
        #${CARVE_WORK_AREA} {
          background-color: lightgrey;
          position: relative;
          top: 2em;
          width: 100%;
          height: calc(100% - 2em);
        }
      </style>
      <div id="${CARVE_TOP_DIV}">
        <slot name="toolbar"></slot>
        <svg id="${CARVE_WORK_AREA}" xmlns="${SVGNS}" viewBox="0 0 100 100">
          <svg id="${CARVE_BACKGROUND}" xmlns="${SVGNS}"x="5" y="5" width="90" height="90" viewBox="0 0 100 100">
            <rect x="0" y="0" width="100" height="100" fill="white" />
          </svg>
          <svg xmlns="${SVGNS}" id="${CARVE_IMAGE}" x="5" y="5" width="90" height="90">
          </svg>
        </svg>
      </div>
    `;
        this.topSVGElem = this.shadowRoot.querySelector(`#${CARVE_IMAGE}`);
    }
    async doNewDoc() {
        this.switchDocument(await createNewDocument());
    }
    async doOpenDoc() {
        if (window['showOpenFilePicker']) {
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
                this.switchDocument(await createDocumentFromFile(handleArray[0]));
            }
            catch (err) {
                alert(err);
            }
        }
        // Else, do the old file picker input thing.
    }
    switchDocument(doc) {
        if (doc !== this.currentDoc) {
            this.currentDoc = doc;
            // Clear out previous SVG doc.
            while (this.topSVGElem.hasChildNodes()) {
                this.topSVGElem.removeChild(this.topSVGElem.firstChild);
            }
            this.topSVGElem.appendChild(this.currentDoc.getSVG());
        }
    }
}
//# sourceMappingURL=editor.js.map