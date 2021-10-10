/**
 * A command used to delete DOM elements from the image.
 */
export class DeleteElementsCommand {
    /** The element to remove from the image. */
    elem;
    /** The parent of the element we are removing. */
    parentElem;
    /** The next sibling of the element we are removing, if any. */
    nextSiblingElem;
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