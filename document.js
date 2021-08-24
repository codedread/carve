/**
 * Wraps an SVG document and stores changes to it.
 */
export class CarveDocument {
    constructor(svgEl, fileHandle) {
        this.fileHandle = fileHandle;
        /** The explicit x,y,width,height attributes on the original SVG document. */
        this.origDocAttrs = new Map();
        /** Any commands lower in the stack than this index have been applied. */
        this.commandIndex = 0;
        /** A stack of all commands in this document's memory. */
        this.commandHistory = [];
        this.svgElem = document.adoptNode(svgEl);
        for (const attr of ['x', 'y', 'width', 'height']) {
            if (this.svgElem.hasAttribute(attr)) {
                this.origDocAttrs.set(attr, this.svgElem.getAttribute(attr));
                this.svgElem.removeAttribute(attr);
            }
        }
    }
    addCommandToStack(cmd) {
        this.commandHistory.push(cmd);
        this.commandIndex = this.commandHistory.length;
    }
    getSVG() {
        return this.svgElem;
    }
}
/** Creates an empty CarveDocument with a blank SVG document. */
export function createNewDocument() {
    const doc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', null);
    doc.documentElement.setAttribute('viewBox', '0 0 100 100');
    console.log('Empty Carve document created.');
    return Promise.resolve(new CarveDocument(doc.rootElement));
}
/**
 * Loads in an SVG file from the file system, parses it and returns a Promise that will resolve to
 * a CarveDocument.
 */
export function createDocumentFromFile(fileHandle) {
    return new Promise((resolve, reject) => {
        fileHandle.getFile().then(file => {
            const fr = new FileReader();
            fr.onload = () => {
                try {
                    const doc = new DOMParser().parseFromString(fr.result, 'image/svg+xml');
                    if (doc.documentElement.tagName !== 'svg') {
                        reject(doc.documentElement.textContent);
                    }
                    console.log('Carve document loaded and parsed.');
                    resolve(new CarveDocument(doc.rootElement, fileHandle));
                }
                catch (err) {
                    reject(err);
                }
            };
            fr.onerror = (err) => reject(err);
            fr.readAsText(file);
        });
    });
}
//# sourceMappingURL=document.js.map