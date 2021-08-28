/**
 * A command used to delete DOM elements from the image.
 */
export class DeleteElementsCommand {
    constructor(elem) {
        this.elem = elem;
        this.parentElem = elem.parentElement;
        this.nextSiblingElem = elem.nextElementSibling;
    }
    apply(host) {
        this.elem = this.parentElem.removeChild(this.elem);
    }
    unapply(host) {
        this.parentElem.insertBefore(this.elem, this.nextSiblingElem);
    }
}
//# sourceMappingURL=delete-elements-command.js.map