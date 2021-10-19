/**
 * A command used to change an attribute value of an image element.
 */
export class ChangeAttributeCommand {
    elem;
    attrName;
    oldAttrValue;
    newAttrValue;
    /**
     * @param elem
     * @param attrName
     * @param oldAttrValue Should be null/undefined if the attribute was not previously set.
     * @param newAttrValue Should be null/undefined if the attribute was removed.
     */
    constructor(elem, attrName, oldAttrValue, newAttrValue) {
        this.elem = elem;
        this.attrName = attrName;
        this.oldAttrValue = oldAttrValue;
        this.newAttrValue = newAttrValue;
    }
    apply(host) {
        if (this.newAttrValue) {
            this.elem.setAttribute(this.attrName, this.newAttrValue);
        }
        else {
            this.elem.removeAttribute(this.attrName);
        }
    }
    unapply(host) {
        if (this.oldAttrValue) {
            this.elem.setAttribute(this.attrName, this.oldAttrValue);
        }
        else {
            this.elem.removeAttribute(this.attrName);
        }
    }
}
//# sourceMappingURL=change-attribute-command.js.map