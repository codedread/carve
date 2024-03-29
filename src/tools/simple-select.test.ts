import 'mocha';
import { expect } from 'chai';
import { EditorHost } from '../editor-host.js';
import { SimpleSelectTool } from './simple-select.js';
import { CarveMouseEvent } from '../carve-mouse-event.js';
import { Selection } from '../selection.js';
import 'global-jsdom/register';
import sinon from 'sinon';
import { DrawingStyle, DEFAULT_DRAWING_STYLE } from '../drawing-style.js';
import { CarveDocument } from '../document/document.js';

// TODO: Mock out SelectionOverlay.

describe('SimpleSelectTool tests', () => {
  /* The tool under test. */
  let tool: SimpleSelectTool;

  /* The editor's Selection. */
  let selection: Selection = new Selection();

  /* The editor overlay's <svg> element. */
  let overlayEl: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  const VIEWBOX_WIDTH = 800;
  const VIEWBOX_HEIGHT = 600;
  const IDENTITY_MATRIX = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

  /* The editor image's <svg> element. */
  let fakeImageEl = {
    getAttribute(attrName: string) {
      switch (attrName) {
        case 'viewBox': return `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`;
      }
      return undefined;
    },
  } as SVGSVGElement;

  /* The transformation matrix of the element that has been selected by the user. */
  let clickedElTransformMatrix = IDENTITY_MATRIX;

  /* The element that has been selected by the user within the image. */
  let clickedEl = {
    parentElement: fakeImageEl,
    getAttribute(attrName: string): string|null {
      switch (attrName) {
        case 'stroke-width': return '4';
      }
      return null;
    },
    getBBox() { return { x: 10, y: 20, width: 100, height: 50 }; },
    getCTM() { return clickedElTransformMatrix; },
    hasAttribute() { return false; },
    removeAttribute: sinon.fake(),
  } as unknown as Element;

  const fakeDocument = {
    getSVG() { return fakeImageEl; },
    getOutputSVG() { return fakeImageEl; },
  } as unknown as CarveDocument;

  /* The EditorHost fake. */
  let fakeEditorHost: EditorHost = {
    addEventListener() {},
    commandExecute() {},
    commandReexecute() { },
    commandUnexecute() { },
    getCurrentDocument() { return fakeDocument; },
    getDrawingStyle(): DrawingStyle { return DEFAULT_DRAWING_STYLE; },
    getOverlay() { return overlayEl; },
    getSelection() { return selection; },
    setDrawingStyle() {},
    switchDocument() { },
  };

  /* Simulates selecting the given element by mousing down, then up. */
  function selectElement(el) {
    const fakeEvent = { mouseEvent: { target: el }};
    tool.onMouseDown(fakeEvent as unknown as CarveMouseEvent);
    tool.onMouseUp(fakeEvent as unknown as CarveMouseEvent);
  }

  beforeEach(() => {
    clickedElTransformMatrix = IDENTITY_MATRIX;
    tool = new SimpleSelectTool(fakeEditorHost);
  });

  afterEach(() => {
    selection.clear();
  })

  it('selects an element, then clears selection', () => {
    selectElement(clickedEl);
    expect(selection.elements().length).equals(1);
    expect(selection.elements()[0]).equals(clickedEl);
    expect(tool.getOverlayUI().isShown()).is.true;

    selectElement(fakeImageEl);
    expect(selection.elements().length).equals(0);
    expect(tool.getOverlayUI().isShown()).is.false;
  });

  // TODO: Move these test into selection-overlay.test.ts.
  it('creates the selector overlay elements', () => {
    selectElement(clickedEl);
    expect(overlayEl.querySelector('#selectorBox')).is.not.null;
    expect(overlayEl.querySelector('#SimpleSelectTool')).is.not.null;
  });

  it('sizes selector overlay width and dasharray properly', () => {
    selectElement(clickedEl);

    // Tool uses the minimum of the viewbox width/height. In our case that is VIEWBOX_HEIGHT.
    const expectedStrokeWidth = (VIEWBOX_HEIGHT / 100) * SimpleSelectTool.SELECTOR_STROKE_SCALE
    const selectorBox = overlayEl.querySelector('#selectorBox') as HTMLElement;
    expect(Number(selectorBox.getAttribute('stroke-width'))).equals(expectedStrokeWidth);
  });

  it('applies transform to the selector overlay elements', () => {
    clickedElTransformMatrix = { a: 0.4, b: -0.9, c: 0.9, d: 0.4, e: -17, f: 76 };
    selectElement(clickedEl);
    const toolEl = overlayEl.querySelector('#SimpleSelectTool') as Element;
    const selectorGroupTransform = toolEl.getAttribute('transform') as string;
    expect(selectorGroupTransform.startsWith('matrix(')).is.true;
  });
});
