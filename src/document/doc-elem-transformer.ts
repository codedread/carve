import { Transformer } from './transformer.js';
import { CARVENS } from '../constants.js';

// TODO: Write a unit test.
export class DocElemTransformer implements Transformer {
  apply(svgEl: SVGSVGElement): SVGSVGElement {
    const outEl = document.importNode(svgEl, true);
    let hasCarveNS = outEl.hasAttribute('xmlns:carve') &&
                     outEl.getAttribute('xmlns:carve') === CARVENS;
    if (!hasCarveNS) {
      throw `Error! Document did not have the Carve namespace, ` +
          `did you apply CarveNamespaceTransformer first?`;
    }

    // If any of x,y,width,height exist on the input doc, then copy them
    // into the Carve namespace to preserve them and remove them from the doc.
    for (const attr of ['x', 'y', 'width', 'height']) {
      if (outEl.hasAttribute(attr)) {
        outEl.setAttributeNS(CARVENS, `carve:${attr}`, outEl.getAttribute(attr));
        outEl.removeAttribute(attr);
      }
    }
    return outEl;
  }

  unapply(svgEl: SVGSVGElement): SVGSVGElement {
    const outEl = document.importNode(svgEl, true);
    for (const attr of ['x', 'y', 'width', 'height']) {
      if (outEl.hasAttributeNS(CARVENS, attr)) {
        // TODO: What if x,y,width,height were set by the editor somehow?
        outEl.setAttribute(attr, outEl.getAttributeNS(CARVENS, attr));
        outEl.removeAttributeNS(CARVENS, attr);
      }
    }
    return outEl;
  }
}