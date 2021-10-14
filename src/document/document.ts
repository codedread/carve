import { CarveNamespaceTransformer } from './carve-namespace-transformer.js';
import { CommandStack } from '../history.js';
import { DocElemTransformer } from './doc-elem-transformer.js';
import { FileSystemFileHandle } from '../types/filesystem.js';
import { HyperlinkTransformer } from './hyperlink-transformer.js';
import { SVGDocument } from '../types/svg.js';
import { TransformationPipeline } from './transformer.js';

const sanitizingPipeline: TransformationPipeline = new TransformationPipeline([
  new CarveNamespaceTransformer(),
  new DocElemTransformer(),
  new HyperlinkTransformer(),
]);

/**
 * Wraps an SVG document and stores changes to it.
 */
export class CarveDocument {
  /** The root document element. */
  private svgElem: SVGSVGElement;

  /** The stack of commands for this document (its editor history). */
  private commandStack: CommandStack = new CommandStack();

  constructor(svgEl: SVGSVGElement, private fileHandle?: FileSystemFileHandle) {
    this.svgElem = sanitizingPipeline.apply(svgEl);
  }

  /** Returns the command stack of this document. */
  getCommandStack(): CommandStack { return this.commandStack; }

  /** Returns the file system file handle. */
  getFileHandle(): FileSystemFileHandle { return this.fileHandle; }

  /** Returns the current <svg> element of this document. */
  getSVG(): SVGSVGElement { return this.svgElem; }

  /** Returns the <svg> element suitable for storage. */
  getOutputSVG(): SVGSVGElement { return sanitizingPipeline.unapply(this.svgElem); }
}

/** Creates an empty CarveDocument with a blank SVG document. */
export function createNewDocument(): Promise<CarveDocument> {
  const doc: Document = document.implementation.createDocument(
      'http://www.w3.org/2000/svg', 'svg', null);
  doc.documentElement.setAttribute('viewBox', '0 0 100 100');
  console.log('Empty Carve document created.')
  return Promise.resolve(new CarveDocument((doc as SVGDocument).rootElement));
}

/**
 * Loads in an SVG file from the file system, parses it and returns a Promise that will resolve to
 * a CarveDocument.
 */
export function createDocumentFromFile(fileHandle: FileSystemFileHandle): Promise<CarveDocument> {
  return new Promise((resolve, reject) => {
    fileHandle.getFile().then(file => {
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const doc: Document = new DOMParser().parseFromString(
              fr.result as string, 'image/svg+xml');
          if (doc.documentElement.tagName !== 'svg') {
            reject(doc.documentElement.textContent);
          }
          console.log('Carve document loaded and parsed.')
          resolve(new CarveDocument((doc as SVGDocument).rootElement, fileHandle));
        } catch (err) {
          reject(err);
        }
      };
      fr.onerror = (err) => reject(err);
      fr.readAsText(file);
    });
  });
}
