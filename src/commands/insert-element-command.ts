import { Command } from './command.js';
import { EditorHost } from '../editor-host.js';

/**
 * A command used to insert a DOM element into the image. Can be used to insert a new element or to
 * move the element from one position in the image's DOM to another.
 */
export class InsertElementCommand implements Command {
  /** The old parent that this element had, if any. */
  private oldParent: SVGElement;
  /** The old next sibling that this element had, if any. */
  private oldNextElementSibling: SVGElement;

  constructor(
      /** The element to insert or reposition in the image. */
      private elem: SVGElement,
      /**
       * The element's new parent (optional). If not specified, the element is added to the
       * editor's image.
       */
      private newParent?: SVGElement,
      /**
       * The element's new next sibling (optional). If not specified, the element is added to the
       * end of the parent's children.
       */
      private newNextElementSibling?: SVGElement) {
    this.oldParent = (elem.parentElement as unknown) as SVGElement;
    this.oldNextElementSibling = (elem.nextElementSibling as unknown) as SVGElement;
  }

  apply(host: EditorHost) {
    if (this.newParent) {
      this.newParent.insertBefore(this.elem, this.newNextElementSibling);
    } else {
      host.getCurrentDocument().getSVG().appendChild(this.elem);
    }
  }

  unapply(host: EditorHost) {
    if (this.oldParent) {
      this.oldParent.insertBefore(this.elem, this.oldNextElementSibling);
    } else {
      this.elem = host.getCurrentDocument().getSVG().removeChild(this.elem);
    }
  }
}
