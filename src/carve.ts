import { CarveEllipseButton, CarveOpenButton, CarveRectangleButton } from './core-toolbar-buttons.js';
import { CarveEditor } from './editor.js';

customElements.define('carve-open-button', CarveOpenButton);
customElements.define('carve-rectangle-button', CarveRectangleButton);
customElements.define('carve-ellipse-button', CarveEllipseButton);

console.log(`Carve custom elements registered.`);
