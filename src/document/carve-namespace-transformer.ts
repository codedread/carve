import { Transformer } from './transformer.js';
import { CARVENS } from '../constants.js';

// TODO: Write a unit test.
export class CarveNamespaceTransformer implements Transformer {
  apply(svgEl: SVGSVGElement): SVGSVGElement {
    const outEl = document.importNode(svgEl, true);
    // It is possible that somehow the Carve namespace leaked out into a SVG doc.
    let hasCarveNS = outEl.hasAttribute('xmlns:carve') &&
                     outEl.getAttribute('xmlns:carve') === CARVENS;
    if (!hasCarveNS) {
      outEl.setAttribute('xmlns:carve', CARVENS);
    }
    return outEl;
  }

  unapply(svgEl: SVGSVGElement): SVGSVGElement {
    const outEl = document.importNode(svgEl, true);
    let hasCarveNS = outEl.hasAttribute('xmlns:carve') &&
                     outEl.getAttribute('xmlns:carve') === CARVENS;
    if (!hasCarveNS) {
      throw `Error! CarveNamespaceTransformer didn't find the xmlns:carve attribute upon unapply()`;
    }

    // Crawl DOM, if any elements or attributes exist in the Carve namespace, throw an error.
    const treeWalker = document.createTreeWalker(outEl, NodeFilter.SHOW_ELEMENT);
    let currentNode = treeWalker.currentNode;
    let foundAnyCarveNSNode = false;
    while (currentNode) {
      let el = currentNode as Element;
      if (el.namespaceURI === CARVENS) {
        foundAnyCarveNSNode = true;
        break;
      }

      const attrs = el.getAttributeNames();
      if (attrs.some(attrName => attrName.startsWith('carve:'))) {
        foundAnyCarveNSNode = true;
        break;
      }

      currentNode = treeWalker.nextNode();
    }

    if (foundAnyCarveNSNode) {
      throw `Error! CarveNamespaceTransform found Carve namespaced elements or attributes. ` +
          `Some earlier transformer did not clean up properly.`;
    }

    outEl.removeAttribute('xmlns:carve')

    return outEl;
  }
}
