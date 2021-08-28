import { CarveEditor } from './editor.js';
import { ACTION_ELLIPSE_MODE, EllipseButton, EllipseTool } from './tools/ellipse.js';
import { ACTION_NEW_DOCUMENT, FileNewButton, FileNewTool } from './tools/file-new.js';
import { ACTION_OPEN_DOCUMENT, FileOpenButton, FileOpenTool } from './tools/file-open.js';
import { ACTION_RECTANGLE_MODE, RectangleButton, RectangleTool } from './tools/rectangle.js';
import { ACTION_SELECT_MODE, SimpleSelectButton, SimpleSelectTool } from './tools/simple-select.js';

const editor = document.querySelector('carve-editor') as CarveEditor;

editor.registerTool(FileNewTool, {'carve-new-button': { ctor: FileNewButton }});
editor.registerTool(FileOpenTool, {'carve-open-button': { ctor: FileOpenButton }})
editor.registerTool(SimpleSelectTool, {'carve-select-button': { ctor: SimpleSelectButton }});
editor.registerTool(RectangleTool, { 'carve-rectangle-button': { ctor: RectangleButton }});
editor.registerTool(EllipseTool, { 'carve-ellipse-button': { ctor: EllipseButton }});

editor.registerKeyBinding('e', ACTION_ELLIPSE_MODE);
editor.registerKeyBinding('n', ACTION_NEW_DOCUMENT);
editor.registerKeyBinding('o', ACTION_OPEN_DOCUMENT);
editor.registerKeyBinding('r', ACTION_RECTANGLE_MODE);
editor.registerKeyBinding('s', ACTION_SELECT_MODE);
