import { EditorHost } from '../editor-host.js';

/** An interface for commands. Can be applied and unapplied by the editor. */
export interface Command {
  apply(host: EditorHost);
  unapply(editorHost: EditorHost);
}
