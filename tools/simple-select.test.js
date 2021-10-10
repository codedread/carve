import 'mocha';
import { expect } from 'chai';
import { SimpleSelectTool } from './simple-select.js';
import { Selection } from '../selection.js';
import 'global-jsdom/register';
//import { JSDOM } from 'jsdom';
describe('SimpleSelectTool tests', () => {
    /* The tool under test. */
    let tool = null;
    /* The editor's Selection. */
    let selection = new Selection();
    /* The editor overlay's <svg> element. */
    let overlayEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const VIEWBOX_WIDTH = 800;
    const VIEWBOX_HEIGHT = 600;
    /* The editor image's <svg> element. */
    let fakeImageEl = {
        getAttribute(attrName) {
            switch (attrName) {
                case 'viewBox': return `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`;
            }
            return undefined;
        },
    };
    /* The element that has been selected by the user within the image. */
    let clickedEl = {
        parentElement: fakeImageEl,
        getAttribute(attrName) {
            switch (attrName) {
                case 'stroke-width': return '4';
            }
            return null;
        },
        getBBox() {
            return { x: 10, y: 20, width: 100, height: 50 };
        },
    };
    /* The EditorHost fake. */
    let fakeEditorHost = {
        addEventListener() { },
        commandExecute() { },
        commandReexecute() { },
        commandUnexecute() { },
        getImage() { return fakeImageEl; },
        getOverlay() { return overlayEl; },
        getSelection() { return selection; },
        switchDocument() { },
    };
    /* Simulates selecting the given element by mousing down, then up. */
    function selectElement(el) {
        const fakeEvent = { mouseEvent: { target: el } };
        tool.onMouseDown(fakeEvent);
        tool.onMouseUp(fakeEvent);
    }
    beforeEach(() => {
        tool = new SimpleSelectTool(fakeEditorHost, { active: true, disabled: false });
    });
    afterEach(() => {
        selection.clear();
    });
    it('selects an element', () => {
        selectElement(clickedEl);
        expect(selection.elements().length).equals(1);
        expect(selection.elements()[0]).equals(clickedEl);
    });
    it('does not select an element if mouseup occurs outside the element', () => {
        tool.onMouseDown({ mouseEvent: { target: clickedEl } });
        tool.onMouseUp({ mouseEvent: { target: fakeImageEl } });
        expect(selection.isEmpty()).is.true;
    });
    it('creates the selector overlay elements', () => {
        selectElement(clickedEl);
        expect(overlayEl.querySelector('#selectorBox')).is.not.null;
    });
    it('sizes selector overlay width and dasharray properly', () => {
        selectElement(clickedEl);
        // Tool uses the minimum of the viewbox width/height. In our case that is VIEWBOX_HEIGHT.
        const expectedStrokeWidth = (VIEWBOX_HEIGHT / 100) * SimpleSelectTool.SELECTOR_STROKE_SCALE;
        const selectorBox = overlayEl.querySelector('#selectorBox');
        expect(Number(selectorBox.getAttribute('stroke-width'))).equals(expectedStrokeWidth);
    });
});
//# sourceMappingURL=simple-select.test.js.map