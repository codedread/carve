import { Command } from './command.js';
import { EditorHost } from '../editor-host.js';

/**
 * A command used to change an attribute value of an image element.
 */
export class ChangeAttributeCommand implements Command {

  /**
   * @param elem 
   * @param attrName 
   * @param oldAttrValue Should be null/undefined if the attribute was not previously set.
   * @param newAttrValue Should be null/undefined if the attribute was removed. 
   */
  constructor(private elem: SVGGraphicsElement, private attrName: string,
              private oldAttrValue: string, private newAttrValue: string) {}

  apply(host: EditorHost) {
    if (this.newAttrValue) {
      this.elem.setAttribute(this.attrName, this.newAttrValue);
    } else {
      this.elem.removeAttribute(this.attrName);
    }
  }

  unapply(host: EditorHost) {
    if (this.oldAttrValue) {
      this.elem.setAttribute(this.attrName, this.oldAttrValue);
    } else {
      this.elem.removeAttribute(this.attrName);
    }
  }
}
