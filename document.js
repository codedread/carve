/**
 * Wraps an SVG document and stores changes to it.
 */
export class CarveDocument {
    constructor(doc, fileHandle) {
        this.doc = doc;
        this.fileHandle = fileHandle;
        /** Any commands lower in the stack than this index have been applied. */
        this.commandIndex = 0;
        /** A stack of all commands in this document's memory. */
        this.commandHistory = [];
    }
    addCommandToStack(cmd) {
        this.commandHistory.push(cmd);
        this.commandIndex = this.commandHistory.length;
    }
    getSVG() {
        return this.doc.rootElement;
    }
}
/** Creates an empty CarveDocument with a blank SVG document. */
export function createNewDocument() {
    const doc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', null);
    doc.documentElement.setAttribute('viewBox', '0 0 100 100');
    console.log('Empty Carve document created.');
    return Promise.resolve(new CarveDocument(doc));
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
                    resolve(new CarveDocument(doc, fileHandle));
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