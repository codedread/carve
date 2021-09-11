import 'mocha';
import { expect } from 'chai';

import { Selection } from './selection.js';
import { DOCUMENT_POSITION_FOLLOWING, DOCUMENT_POSITION_PRECEDING } from './constants.js';

describe('Selection tests', () => {
  const ELEM_1 = {
    compareDocumentPosition() { return DOCUMENT_POSITION_FOLLOWING; },
    getAttribute(attrName: string): string {
      switch (attrName) {
        case 'stroke-width': return '4';
      }
      return null;
    },
    getBBox() { return {x: 10, y: 20, width: 200, height: 100}; },
  };
  const ELEM_2 = {
    compareDocumentPosition() { return DOCUMENT_POSITION_PRECEDING; },
    getAttribute(attrName: string): string {
      switch (attrName) {
        case 'stroke-width': return '4';
      }
      return null;
    },
    getBBox() { return {x: -10, y: -20, width: 30, height: 40}; },
  };

  it('should handle empty Selections properly.', () => {
    const sel = new Selection();
    expect(sel.isEmpty()).is.true;
    expect(sel.isNonEmpty()).is.false;
    expect(sel.getBBox()).is.null;
  });

  it('should handle basic bbox', () => {
    const sel = new Selection();
    sel.add(ELEM_1 as any);

    // Bounding box includes half the stroke width.
    const bbox = sel.getBBox();
    expect(bbox.x).equals(8);
    expect(bbox.y).equals(18);
    expect(bbox.w).equals(204);
    expect(bbox.h).equals(104);
  });

  it('should handle bbox of more than one element', () => {
    const sel = new Selection();
    sel.add(ELEM_1 as any);
    sel.add(ELEM_2 as any);

    expect(sel.elements().length).equals(2);

    const bbox = sel.getBBox();
    expect(bbox.x).equals(-12);
    expect(bbox.y).equals(-22);
    expect(bbox.w).equals(224); // (200 + 10) - (-10) + 4
    expect(bbox.h).equals(144); // (100 + 20) - (-10) + 4
  });

  it('should be able to remove elements from selection', () => {
    const sel = new Selection();
    sel.add(ELEM_1 as any);
    sel.add(ELEM_2 as any);
    sel.remove(ELEM_1 as any);

    expect(sel.elements().length).equals(1);

    const bbox = sel.getBBox();
    expect(bbox.x).equals(-12);
    expect(bbox.y).equals(-22);
    expect(bbox.w).equals(34);
    expect(bbox.h).equals(44);
  });

  it('should be able to clear', () => {
    const sel = new Selection();
    sel.add(ELEM_1 as any);
    sel.add(ELEM_2 as any);
    sel.clear();

    expect(sel.isEmpty()).is.true;
  });

  it('should be able to set', () => {
    const sel = new Selection();
    sel.set([ELEM_1 as any, ELEM_2 as any]);

    expect(sel.elements().length).equals(2);

    const bbox = sel.getBBox();
    expect(bbox.x).equals(-12);
    expect(bbox.y).equals(-22);
    expect(bbox.w).equals(224);
    expect(bbox.h).equals(144);
  });
});
