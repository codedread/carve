import { ACTION_DELETE, DeleteButton, DeleteTool } from './tools/delete.js';
import { ACTION_ELLIPSE_MODE, EllipseButton, EllipseTool } from './tools/ellipse.js';
import { ACTION_NEW_DOCUMENT, FileNewButton, FileNewTool } from './tools/file-new.js';
import { ACTION_OPEN_DOCUMENT, FileOpenButton, FileOpenTool } from './tools/file-open.js';
import { ACTION_SAVE_DOCUMENT_AS, FileSaveAsButton, FileSaveAsTool } from './tools/file-save-as.js';
import { ACTION_PAINT_FILL, PaintFillButton, PaintFillTool } from './tools/paint-fill.js';
import { ACTION_RECTANGLE_MODE, RectangleButton, RectangleTool } from './tools/rectangle.js';
import { ACTION_REDO, RedoButton, RedoTool } from './tools/redo.js';
import { ACTION_SELECT_MODE, SimpleSelectButton, SimpleSelectTool } from './tools/simple-select.js';
import { ACTION_UNDO, UndoButton, UndoTool } from './tools/undo.js';
const editor = document.querySelector('carve-editor');
editor
    // Register all tools and their UI elements.
    .registerTool(FileNewTool, { 'carve-new-button': { ctor: FileNewButton } })
    .registerTool(FileOpenTool, { 'carve-open-button': { ctor: FileOpenButton } })
    .registerTool(FileSaveAsTool, { 'carve-save-as-button': { ctor: FileSaveAsButton } })
    .registerTool(PaintFillTool, { 'carve-paint-fill-button': { ctor: PaintFillButton } })
    .registerTool(UndoTool, { 'carve-undo-button': { ctor: UndoButton } })
    .registerTool(RedoTool, { 'carve-redo-button': { ctor: RedoButton } })
    .registerTool(DeleteTool, { 'carve-delete-button': { ctor: DeleteButton } })
    // TODO: Make a new vertical toolbar for these.
    .registerTool(SimpleSelectTool, { 'carve-select-button': { ctor: SimpleSelectButton } })
    .registerTool(RectangleTool, { 'carve-rectangle-button': { ctor: RectangleButton } })
    .registerTool(EllipseTool, { 'carve-ellipse-button': { ctor: EllipseButton } })
    // Register key bindings, mapping them to actions.
    .registerKeyBinding('a', ACTION_SAVE_DOCUMENT_AS)
    .registerKeyBinding('e', ACTION_ELLIPSE_MODE)
    .registerKeyBinding('f', ACTION_PAINT_FILL)
    .registerKeyBinding('n', ACTION_NEW_DOCUMENT)
    .registerKeyBinding('o', ACTION_OPEN_DOCUMENT)
    .registerKeyBinding('r', ACTION_RECTANGLE_MODE)
    .registerKeyBinding('s', ACTION_SELECT_MODE)
    .registerKeyBinding('z', ACTION_UNDO)
    .registerKeyBinding('y', ACTION_REDO)
    .registerKeyBinding('Delete', ACTION_DELETE);
//# sourceMappingURL=register-tools.js.map