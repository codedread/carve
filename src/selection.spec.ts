import 'mocha';
import { expect } from 'chai';

import { Selection } from './selection.js';
import { SVGNS } from './constants.js';

describe('Selection tests', () => {
  it('should handle empty Selections properly.', () => {
    const sel = new Selection();
    expect(sel.isEmpty()).is.true;
    expect(sel.isNonEmpty()).is.false;
    expect(sel.getBBox()).is.null;
  });

  it('should handle basic bbox', () => {
    const sel = new Selection();
    sel.add({ getBBox: () => { return {x: 10, y: 20, width: 200, height: 100}; }} as any);

    const bbox = sel.getBBox();
    expect(bbox.x).equals(10);
    expect(bbox.y).equals(20);
    expect(bbox.w).equals(200);
    expect(bbox.h).equals(100);
  });

  it('should handle bbox of more than one element', () => {
    const sel = new Selection();
    sel.add({
      compareDocumentPosition: () => {return 2;},
      getBBox: () => { return {x: 10, y: 20, width: 200, height: 100}; }
    } as any);
    sel.add({
      compareDocumentPosition: () => {return 4;},
      getBBox: () => { return {x: -10, y: -20, width: 10, height: 10}; }
    } as any);

    const bbox = sel.getBBox();
    expect(bbox.x).equals(-10);
    expect(bbox.y).equals(-20);
    expect(bbox.w).equals(220); // (200 + 10) - (-10)
    expect(bbox.h).equals(140); // (100 + 20) - (-10)
  });
});
