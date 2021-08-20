import { CarveAction } from './actions.js';
import { CarveDocument, loadDocument } from './document.js';
import { FileSystemFileHandle } from './types/filesystem.js';
import { keyToAction } from './keys.js';

/**
 * An CarveEditor can open a CarveDocument and can attach a view to the active document.
 */
export class CarveEditor extends HTMLElement {
  currentDoc: CarveDocument;
  topSVGElem: SVGSVGElement;

  constructor() {
    super();
    this.createShadowDOM();
    window.addEventListener('keyup', this);
  }

  handleEvent(e: Event) {
    let action: CarveAction;
    if (e instanceof KeyboardEvent) {
      action = keyToAction(e.key);
    }

    switch (action) {
      case CarveAction.OPEN_DOCUMENT: this.doOpenDoc(); break;
    }
  }

  private createShadowDOM() {
    this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'
    this.topSVGElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.shadowRoot.append(this.topSVGElem);
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
        this.currentDoc = await loadDocument(handleArray[0]);

        // Clear out previous SVG doc.
        while (this.topSVGElem.hasChildNodes()) {
          this.topSVGElem.removeChild(this.topSVGElem.firstChild);
        }
        this.topSVGElem.appendChild(this.currentDoc.getSVG());
      } catch (err) {
        alert(err);
      }
    }
    // Else, do the old file picker input thing.
  }
}
