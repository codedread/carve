import { Command } from './commands/command.js';
import { CarveDocument } from './document/document.js';
import { DrawingStyle } from './drawing-style.js';
import { Selection } from './selection.js';

/** An interface that CarveEditor implements. It exposes certain methods to Commands/Tools.*/
export interface EditorHost {
  /** Adds an event listener to the EditorHost. */
  addEventListener(type: string, listener: EventListenerOrEventListenerObject,
      opts?: boolean|AddEventListenerOptions);

  /** Executes the given command on the current document. */
  commandExecute(cmd: Command);

  /** Re-applies the most recent command on the current document, if possible. */
  commandReexecute();

  /** Un-applies the most recent command on the current document, if possible. */
  commandUnexecute();

  /** Gets the current drawing style of the editor. */
  getDrawingStyle(): DrawingStyle;

  /** Gets the current <svg> element of the current document's image. */
  getImage(): SVGSVGElement;

  /** Gets the <svg> element of the current document's image suitable for storage. */
  getOutputImage(): SVGSVGElement;

  /** Gets the <svg> element being used by the editor as an overlay layer. */
  getOverlay(): SVGSVGElement;

  /** Gets the current selection in the editor. */
  getSelection(): Selection;

  /** Switches the current document of the Editor to a new document. */
  switchDocument(doc: CarveDocument);
}
