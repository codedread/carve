import { ACTION_DELETE, DeleteButton, DeleteTool } from './tools/delete.js';
import { ACTION_ELLIPSE_MODE, EllipseButton, EllipseTool } from './tools/ellipse.js';
import { ACTION_NEW_DOCUMENT, FileNewButton, FileNewTool } from './tools/file-new.js';
import { ACTION_OPEN_DOCUMENT, FileOpenButton, FileOpenTool } from './tools/file-open.js';
import { ACTION_RECTANGLE_MODE, RectangleButton, RectangleTool } from './tools/rectangle.js';
import { ACTION_SELECT_MODE, SimpleSelectButton, SimpleSelectTool } from './tools/simple-select.js';
const editor = document.querySelector('carve-editor');
editor
    // Register all tools and their UI elements.
    .registerTool(FileNewTool, { 'carve-new-button': { ctor: FileNewButton } })
    .registerTool(FileOpenTool, { 'carve-open-button': { ctor: FileOpenButton } })
    .registerTool(SimpleSelectTool, { 'carve-select-button': { ctor: SimpleSelectButton } })
    .registerTool(DeleteTool, { 'carve-delete-button': { ctor: DeleteButton } })
    .registerTool(RectangleTool, { 'carve-rectangle-button': { ctor: RectangleButton } })
    .registerTool(EllipseTool, { 'carve-ellipse-button': { ctor: EllipseButton } })
    // Register key bindings, mapping them to actions.
    .registerKeyBinding('e', ACTION_ELLIPSE_MODE)
    .registerKeyBinding('n', ACTION_NEW_DOCUMENT)
    .registerKeyBinding('o', ACTION_OPEN_DOCUMENT)
    .registerKeyBinding('r', ACTION_RECTANGLE_MODE)
    .registerKeyBinding('s', ACTION_SELECT_MODE)
    .registerKeyBinding('Delete', ACTION_DELETE);
//# sourceMappingURL=register-tools.js.map