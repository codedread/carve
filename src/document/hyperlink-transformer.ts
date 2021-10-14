import { Transformer } from './transformer.js';
import { CARVENS, XLINKNS } from '../constants.js';

export class HyperlinkTransformer implements Transformer {
  apply(svgEl: SVGSVGElement): SVGSVGElement {
    const outEl = document.importNode(svgEl, true);
    let hasCarveNS = outEl.hasAttribute('xmlns:carve') &&
                     outEl.getAttribute('xmlns:carve') === CARVENS;
    if (!hasCarveNS) {
      throw `Error! Document did not have the Carve namespace, ` +
          `did you apply CarveNamespaceTransformer first?`;
    }

    // Look for any <a> elements.
    const aElems = outEl.getElementsByTagName('a');
    for (let i = 0; i < aElems.length; ++i) {
      const aElem = aElems.item(i);
      const href = aElem.getAttributeNS(XLINKNS, 'href');
      if (href) {
        aElem.setAttributeNS(CARVENS, 'carve:href', href);
        aElem.removeAttributeNS(XLINKNS, 'href');
      }
    }
    return outEl;
  }

  unapply(svgEl: SVGSVGElement): SVGSVGElement {
    const outEl = document.importNode(svgEl, true);
    const aElems = outEl.getElementsByTagName('a');
    for (let i = 0; i < aElems.length; ++i) {
      const aElem = aElems.item(i);
      const href = aElem.getAttributeNS(CARVENS, 'href');
      if (href) {
        aElem.setAttributeNS(XLINKNS, 'xlink:href', href);
        aElem.removeAttributeNS(CARVENS, 'href');
      }
    }
    return outEl;
  }
}