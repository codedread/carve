import { Command } from './commands/command.js';
import { CarveDocument } from './document.js';
import { Selection } from './selection.js';

/** An interface that CarveEditor implements. It exposes certain methods to Commands/Tools.*/
export interface EditorHost {
  /** Executes the given command on the current document. */
  execute(cmd: Command);

  /** Gets the <svg> element of the current document's image. */
  getImage(): SVGSVGElement;

  /** Gets the <svg> element being used by the editor as an overlay layer. */
  getOverlay(): SVGSVGElement;

  /** Gets the current selection in the editor. */
  getSelection(): Selection;

  /** Switches the current document of the Editor to a new document. */
  switchDocument(doc: CarveDocument);
}
