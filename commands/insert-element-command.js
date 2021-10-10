/**
 * A command used to insert a DOM element into the image. Can be used to insert a new element or to
 * move the element from one position in the image's DOM to another.
 */
export class InsertElementCommand {
    elem;
    newParent;
    newNextElementSibling;
    /** The old parent that this element had, if any. */
    oldParent;
    /** The old next sibling that this element had, if any. */
    oldNextElementSibling;
    constructor(
    /** The element to insert or reposition in the image. */
    elem, 
    /**
     * The element's new parent (optional). If not specified, the element is added to the
     * editor's image.
     */
    newParent, 
    /**
     * The element's new next sibling (optional). If not specified, the element is added to the
     * end of the parent's children.
     */
    newNextElementSibling) {
        this.elem = elem;
        this.newParent = newParent;
        this.newNextElementSibling = newNextElementSibling;
        this.oldParent = elem.parentElement;
        this.oldNextElementSibling = elem.nextElementSibling;
    }
    apply(host) {
        if (this.newParent) {
            this.newParent.insertBefore(this.elem, this.newNextElementSibling);
        }
        else {
            host.getImage().appendChild(this.elem);
        }
    }
    unapply(host) {
        if (this.oldParent) {
            this.oldParent.insertBefore(this.elem, this.oldNextElementSibling);
        }
        else {
            this.elem = host.getImage().removeChild(this.elem);
        }
    }
}
//# sourceMappingURL=insert-element-command.js.map