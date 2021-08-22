import { Command } from './command.js';
import { EditorHost } from '../editor-host.js';

/**
 * A command used to insert a DOM element into the image. Can be used to insert a new element or to
 * move the element from one position in the image's DOM to another.
 */
export class InsertElementCommand implements Command {
  private oldParent: SVGElement;
  private oldNextElementSibling: SVGElement;

  constructor(private elem: SVGElement,
    private newParent?: SVGElement,
    private newNextElementSibling?: SVGElement) {
    this.oldParent = (elem.parentElement as unknown) as SVGElement;
    this.oldNextElementSibling = (elem.nextElementSibling as unknown) as SVGElement;
  }

  apply(host: EditorHost) {
    if (this.newParent) {
      this.newParent.insertBefore(this.elem, this.newNextElementSibling);
    } else {
      host.getImage().appendChild(this.elem);
    }
  }

  unapply(host: EditorHost) {
    if (this.oldParent) {
      this.oldParent.insertBefore(this.elem, this.oldNextElementSibling);
    } else {
      this.elem = host.getImage().removeChild(this.elem);
    }
  }
}
