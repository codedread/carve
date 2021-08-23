import { Command } from './commands/command.js';

/** An interface that CarveEditor implements. It exposes certain methods to Commands/Tools.*/
export interface EditorHost {
  /** Executes the given command on the current document. */
  execute(cmd: Command);
  /** Gets the <svg> element of the current document's image. */
  getImage(): SVGSVGElement;
  /** Gets the <svg> element being used by the editor as an overlay layer. */
  getOverlay(): SVGSVGElement;
}