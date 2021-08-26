import { CarveEditor } from './editor.js';
import { FileNewTool, FileNewButton } from './tools/file-new.js';
import { FileOpenButton, FileOpenTool } from './tools/file-open.js';

const editor = document.querySelector('carve-editor') as CarveEditor;

editor.registerTool(FileNewTool, {'carve-new-button': { ctor: FileNewButton }});
editor.registerTool(FileOpenTool, {'carve-open-button': { ctor: FileOpenButton }})
