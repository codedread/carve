import { ACTION_STOP_DRAWING } from './editor.js';
import { Keys } from './key-handler.js';
import { ACTION_DELETE, DeleteButton, DeleteTool } from './tools/delete.js';
import { ACTION_ELLIPSE_MODE, EllipseButton, EllipseTool } from './tools/ellipse.js';
import { ACTION_NEW_DOCUMENT, FileNewButton, FileNewTool } from './tools/file-new.js';
import { ACTION_OPEN_DOCUMENT, FileOpenButton, FileOpenTool } from './tools/file-open.js';
import { ACTION_SAVE_DOCUMENT, ACTION_SAVE_DOCUMENT_AS, FileSaveAsButton, FileSaveAsTool } from './tools/file-save-as.js';
import { ACTION_PAINT_FILL, PaintFillButton, PaintFillTool } from './tools/paint-fill.js';
import { ACTION_PAINT_STROKE, PaintStrokeButton, PaintStrokeTool } from './tools/paint-stroke.js';
import { ACTION_RECTANGLE_MODE, RectangleButton, RectangleTool } from './tools/rectangle.js';
import { ACTION_REDO, RedoButton, RedoTool } from './tools/redo.js';
import { ACTION_SELECT_MODE, SimpleSelectButton, SimpleSelectTool } from './tools/simple-select.js';
import { ACTION_UNDO, UndoButton, UndoTool } from './tools/undo.js';
const editor = document.querySelector('carve-editor');
// We are using keyup' as the event that triggers a key action. Unfortunately,
// Mac has issues with using the CMD/Apple key for shortcuts in browsers on keyup.
// See https://stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key
const CMD = /*navigator.platform.toLowerCase().indexOf('mac') === 0 ? Keys.META : */ Keys.CTRL;
editor
    // Register all tools and their UI elements.
    .registerTool(FileNewTool, { 'carve-new-button': { ctor: FileNewButton } })
    .registerTool(FileOpenTool, { 'carve-open-button': { ctor: FileOpenButton } })
    .registerTool(FileSaveAsTool, { 'carve-save-as-button': { ctor: FileSaveAsButton } })
    .registerTool(PaintFillTool, { 'carve-paint-fill-button': { ctor: PaintFillButton } })
    .registerTool(PaintStrokeTool, { 'carve-paint-stroke-button': { ctor: PaintStrokeButton } })
    .registerTool(UndoTool, { 'carve-undo-button': { ctor: UndoButton } })
    .registerTool(RedoTool, { 'carve-redo-button': { ctor: RedoButton } })
    .registerTool(DeleteTool, { 'carve-delete-button': { ctor: DeleteButton } })
    // TODO: Make a new vertical toolbar for these.
    .registerTool(SimpleSelectTool, { 'carve-select-button': { ctor: SimpleSelectButton } })
    .registerTool(RectangleTool, { 'carve-rectangle-button': { ctor: RectangleButton } })
    .registerTool(EllipseTool, { 'carve-ellipse-button': { ctor: EllipseButton } })
    // Register actions and their respective key bindings.
    .registerActionForKeyBinding(ACTION_STOP_DRAWING, ['Escape'])
    .registerActionForKeyBinding(ACTION_SAVE_DOCUMENT, [CMD, 's'])
    .registerActionForKeyBinding(ACTION_SAVE_DOCUMENT_AS, [CMD, Keys.ALT, Keys.SHIFT, 'S'])
    .registerActionForKeyBinding(ACTION_ELLIPSE_MODE, ['e'])
    .registerActionForKeyBinding(ACTION_PAINT_FILL, ['f'])
    .registerActionForKeyBinding(ACTION_PAINT_STROKE, ['k'])
    .registerActionForKeyBinding(ACTION_NEW_DOCUMENT, [CMD, 'n'])
    .registerActionForKeyBinding(ACTION_OPEN_DOCUMENT, [CMD, 'o'])
    .registerActionForKeyBinding(ACTION_RECTANGLE_MODE, ['r'])
    .registerActionForKeyBinding(ACTION_SELECT_MODE, ['s'])
    .registerActionForKeyBinding(ACTION_UNDO, [CMD, 'z'])
    .registerActionForKeyBinding(ACTION_REDO, [CMD, 'y'])
    .registerActionForKeyBinding(ACTION_DELETE, ['Delete']);
//# sourceMappingURL=register-tools.js.map