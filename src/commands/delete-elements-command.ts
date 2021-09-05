import { Command } from './command.js';
import { EditorHost } from '../editor-host.js';

/**
 * A command used to delete DOM elements from the image.
 */
export class DeleteElementsCommand implements Command {
  /** The element to remove from the image. */
  private elem: SVGGraphicsElement;
  /** The parent of the element we are removing. */
  private parentElem: SVGElement;
  /** The next sibling of the element we are removing, if any. */
  private nextSiblingElem: SVGElement;

  constructor(elem: SVGGraphicsElement) {
    this.elem = elem;
    this.parentElem = elem.parentElement as unknown as SVGElement;
    this.nextSiblingElem = elem.nextElementSibling as SVGElement;
  }

  apply(host: EditorHost) {
    this.elem = this.parentElem.removeChild(this.elem);
  }

  unapply(host: EditorHost) {
    this.parentElem.insertBefore(this.elem, this.nextSiblingElem);
  }
}
