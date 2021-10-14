import 'mocha';
import { expect } from 'chai';
import { CarveNamespaceTransformer } from './carve-namespace-transformer.js';
import { CARVENS, SVGNS } from '../constants.js';
import 'global-jsdom/register';

describe('CarveNamespaceTransformer tests', () => {
  let inEl: SVGSVGElement;
  let xformer: CarveNamespaceTransformer;

  beforeEach(() => {
    xformer = new CarveNamespaceTransformer();
    inEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  });

  it('adds the xmlns:carve attribute', () => {
    const outEl = xformer.apply(inEl);
    expect(outEl.hasAttribute('xmlns:carve')).is.true;
    expect(outEl.getAttribute('xmlns:carve')).equals(CARVENS);
  });

  it('removes the xmlns:carve attribute', () => {
    inEl.setAttribute('xmlns:carve', CARVENS);
    const outEl = xformer.unapply(inEl);

    expect(outEl.hasAttribute('xmlns:carve')).is.false;
  });

  it('throws an error if xmlns:carve attribute is not present on unapply', () => {
    expect(() => xformer.unapply(inEl)).to.throw();
  });

  it('throws an error if carve attributes exist on unapply', () => {
    inEl.setAttribute('xmlns:carve', CARVENS);
    const rect = document.createElementNS(SVGNS, 'rect');
    rect.setAttributeNS(CARVENS, 'carve:foo', 'bar');
    inEl.appendChild(rect);

    expect(() => xformer.unapply(inEl)).to.throw();
  });
});
