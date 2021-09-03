/**
 * Wraps an SVG document and stores changes to it.
 */
export class CarveDocument {
    fileHandle;
    /** The root document element. */
    svgElem;
    /** The explicit x,y,width,height attributes on the original SVG document. */
    origDocAttrs = new Map();
    /** Any commands lower in the stack than this index have been applied. */
    commandIndex = 0;
    /** A stack of all commands in this document's memory. */
    commandHistory = [];
    constructor(svgEl, fileHandle) {
        this.fileHandle = fileHandle;
        this.svgElem = document.adoptNode(svgEl);
        for (const attr of ['x', 'y', 'width', 'height']) {
            if (this.svgElem.hasAttribute(attr)) {
                this.origDocAttrs.set(attr, this.svgElem.getAttribute(attr));
                this.svgElem.removeAttribute(attr);
            }
        }
    }
    /** Adds the command to the document's stack and increments the command index. */
    addCommandToStack(cmd) {
        // Blow away all commands at the index and beyond.
        if (this.commandIndex < this.commandHistory.length) {
            this.commandHistory = this.commandHistory.slice(0, this.commandIndex);
        }
        this.commandHistory.push(cmd);
        this.commandIndex = this.commandHistory.length;
    }
    getCommandIndex() { return this.commandIndex; }
    getCommandStackLength() { return this.commandHistory.length; }
    getSVG() {
        return this.svgElem;
    }
    /**
     * Increments the command index if the command stack has been rewound and returns the command
     * just re-applied.
     */
    redoCommand() {
        if (this.commandIndex < this.commandHistory.length) {
            this.commandIndex = this.commandIndex + 1;
            return this.commandHistory[this.commandIndex - 1];
        }
        return null;
    }
    /** Decrements the command index if there are any commands and returns the command just rewound. */
    rewindCommand() {
        if (this.commandIndex > 0) {
            this.commandIndex = this.commandIndex - 1;
            return this.commandHistory[this.commandIndex];
        }
        return null;
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