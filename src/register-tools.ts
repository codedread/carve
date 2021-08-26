import { CarveEditor } from './editor.js';
import { FileNewTool, FileNewButton } from './tools/file-new.js';

const editor = document.querySelector('carve-editor') as CarveEditor;
debugger;

editor.registerTool(FileNewTool, {'carve-new-button': { ctor: FileNewButton }});
