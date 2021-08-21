import { CarveAction } from './actions.js';
import { CarveDocument, createDocumentFromFile, createNewDocument } from './document.js';
import { FileSystemFileHandle } from './types/filesystem.js';
import { keyToAction } from './keys.js';

const CARVE_TOP_DIV = 'carveTopDiv';
const CARVE_WORK_AREA = 'carveWorkArea';
const CARVE_BACKGROUND = 'carveBackground';
const CARVE_IMAGE = 'carveImage';
const SVGNS = 'http://www.w3.org/2000/svg';

/**
 * A CarveEditor can open a CarveDocument into the work area.
 */
export class CarveEditor extends HTMLElement {
  currentDoc: CarveDocument;
  topSVGElem: SVGSVGElement;

  constructor() {
    super();
    this.createShadowDOM();
    window.addEventListener('keyup', this);
    createNewDocument().then(doc => this.switchDocument(doc));
  }

  handleEvent(e: Event) {
    let action: CarveAction;
    if (e instanceof KeyboardEvent) {
      action = keyToAction(e.key);
    }

    switch (action) {
      case CarveAction.NEW_DOCUMENT: this.doNewDoc(); break;
      case CarveAction.OPEN_DOCUMENT: this.doOpenDoc(); break;
    }
  }

  private createShadowDOM() {
    this.attachShadow({mode: 'open'}).innerHTML = `
      <style type="text/css">
        #${CARVE_TOP_DIV} {
          background-color: lightgrey;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
        svg#${CARVE_WORK_AREA} {
          background-color: lightgrey;
        }
      </style>
      <div id="${CARVE_TOP_DIV}">
        <svg id="${CARVE_WORK_AREA}" xmlns="${SVGNS}" width="100%" height="100%" viewBox="0 0 100 100">
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

  private async doNewDoc() {
    this.switchDocument(await createNewDocument());
  }

  private async doOpenDoc() {
    if (window['showOpenFilePicker']) {
      try {
        const handleArray: FileSystemFileHandle[] = await window['showOpenFilePicker']({
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
      } catch (err) {
        alert(err);
      }
    }
    // Else, do the old file picker input thing.
  }

  private switchDocument(doc: CarveDocument) {
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
