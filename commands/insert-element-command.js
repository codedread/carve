/**
 * A command used to insert a DOM element into the image. Can be used to insert a new element or to
 * move the element from one position in the image's DOM to another.
 */
export class InsertElementCommand {
    elem;
    newParent;
    newNextElementSibling;
    oldParent;
    oldNextElementSibling;
    constructor(elem, newParent, newNextElementSibling) {
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