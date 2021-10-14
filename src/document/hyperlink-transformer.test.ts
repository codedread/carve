import 'mocha';
import { expect } from 'chai';
import { HyperlinkTransformer } from './hyperlink-transformer.js';
import 'global-jsdom/register';
import { CARVENS, SVGNS, XLINKNS } from '../constants.js';

describe('HyperlinkTransformer tests', () => {
  const URL = 'http://example.com/';
  let inEl: SVGSVGElement;
  let xformer: HyperlinkTransformer;

  beforeEach(() => {
    xformer = new HyperlinkTransformer();
    inEl = document.createElementNS(SVGNS, 'svg');
    inEl.setAttribute('xmlns:carve', CARVENS);
    const aElem = document.createElementNS(SVGNS, 'a');
    aElem.setAttributeNS(XLINKNS, 'xlink:href', URL);
    inEl.appendChild(aElem);
  });

  it('Moves the xlink:href value to the Carve namespace on apply()', () => {
    const outEl = xformer.apply(inEl);
    const aElems = outEl.getElementsByTagName('a');
    expect(aElems.length).equals(1);
    const aElem = aElems.item(0);
    expect(aElem.hasAttributeNS(XLINKNS, 'href')).is.false;
    expect(aElem.hasAttributeNS(CARVENS, 'href')).is.true;
    expect(aElem.getAttributeNS(CARVENS, 'href')).equals(URL);
  });

  it('Moves the xlink:href value to the xlink namespace on unapply()', () => {
    const aElemIn = inEl.getElementsByTagName('a').item(0);
    aElemIn.setAttributeNS(CARVENS, 'carve:href', URL);
    aElemIn.removeAttributeNS(XLINKNS, 'href');

    const outEl = xformer.unapply(inEl);
    const aElems = outEl.getElementsByTagName('a');
    expect(aElems.length).equals(1);
    const aElem = aElems.item(0);
    expect(aElem.hasAttributeNS(CARVENS, 'href')).is.false;
    expect(aElem.hasAttributeNS(XLINKNS, 'href')).is.true;
    expect(aElem.getAttributeNS(XLINKNS, 'href')).equals(URL);
  });
});
