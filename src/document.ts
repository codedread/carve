import { FileSystemFileHandle } from './types/filesystem.js';
import { SVGDocument } from './types/svg.js';

/**
 * Wraps an SVG document and stores changes to it.
 */
export class CarveDocument {
  constructor(private fileHandle: FileSystemFileHandle, private doc: SVGDocument) {}

  getSVG(): SVGSVGElement {
    return this.doc.rootElement;
  }
}

/**
 * Loads in an SVG file from the file system, parses it and returns a Promise that will resolve to
 * a CarveDocument.
 */
export function loadDocument(fileHandle: FileSystemFileHandle): Promise<CarveDocument> {
  return new Promise((resolve, reject) => {
    fileHandle.getFile().then(file => {
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const doc: Document = new DOMParser().parseFromString(fr.result as string, 'image/svg+xml');
          if (doc.documentElement.tagName !== 'svg') {
            reject(doc.documentElement.textContent);
          }
          console.log('Carve document loaded and parsed.')
          resolve(new CarveDocument(fileHandle, doc as SVGDocument));
        } catch (err) {
          reject(err);
        }
      };
      fr.onerror = (err) => reject(err);
      fr.readAsText(file);
    });
  });
}
