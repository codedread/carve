import { Command } from './commands/command.js';
import { FileSystemFileHandle } from './types/filesystem.js';
import { SVGDocument } from './types/svg.js';

/**
 * Wraps an SVG document and stores changes to it.
 */
export class CarveDocument {
  /** Any commands lower in the stack than this index have been applied. */
  private commandIndex: number = 0;
  /** A stack of all commands in this document's memory. */
  private commandHistory: Command[] = [];

  constructor(private doc: SVGDocument, private fileHandle?: FileSystemFileHandle) {}

  addCommandToStack(cmd: Command) {
    this.commandHistory.push(cmd);
    this.commandIndex = this.commandHistory.length;
  }

  getSVG(): SVGSVGElement {
    return this.doc.rootElement;
  }
}


/** Creates an empty CarveDocument with a blank SVG document. */
export function createNewDocument(): Promise<CarveDocument> {
  const doc: Document = document.implementation.createDocument(
      'http://www.w3.org/2000/svg', 'svg', null);
  doc.documentElement.setAttribute('viewBox', '0 0 100 100');
  console.log('Empty Carve document created.')
  return Promise.resolve(new CarveDocument(doc as SVGDocument));
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
          resolve(new CarveDocument(doc as SVGDocument, fileHandle));
        } catch (err) {
          reject(err);
        }
      };
      fr.onerror = (err) => reject(err);
      fr.readAsText(file);
    });
  });
}
