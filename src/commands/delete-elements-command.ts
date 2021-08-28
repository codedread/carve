import { Command } from './command.js';
import { EditorHost } from '../editor-host.js';

/**
 * A command used to delete DOM elements from the image.
 */
export class DeleteElementsCommand implements Command {
  private elem: SVGGraphicsElement;
  private parentElem: SVGElement;
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
