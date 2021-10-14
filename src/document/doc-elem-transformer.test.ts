import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { DocElemTransformer } from './doc-elem-transformer.js';
import 'global-jsdom/register';
import { CARVENS } from '../constants.js';

describe('DocElemTransformer tests', () => {
  let inEl: SVGSVGElement;
  let xformer: DocElemTransformer;

  beforeEach(() => {
    xformer = new DocElemTransformer();
    inEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    inEl.setAttribute('xmlns:carve', CARVENS);
  });

  it('Moves attribute values to the Carve namespace on apply()', () => {
    inEl.setAttribute('width', '1');
    inEl.setAttribute('height', '2');
    inEl.setAttribute('x', '3');
    inEl.setAttribute('y', '4');
    inEl.setAttribute('foo', 'bar');

    const outEl = xformer.apply(inEl);

    expect(outEl.hasAttribute('x')).is.false;
    expect(outEl.hasAttribute('y')).is.false;
    expect(outEl.hasAttribute('width')).is.false;
    expect(outEl.hasAttribute('height')).is.false;
    expect(outEl.hasAttribute('foo')).is.true;
    expect(outEl.getAttribute('foo')).equals('bar');
    expect(outEl.getAttributeNS(CARVENS, 'width')).equals('1');
    expect(outEl.getAttributeNS(CARVENS, 'height')).equals('2');
    expect(outEl.getAttributeNS(CARVENS, 'x')).equals('3');
    expect(outEl.getAttributeNS(CARVENS, 'y')).equals('4');
  });

  it('throws an error if xmlns:carve is not present on apply()', () => {
    inEl.removeAttribute('xmlns:carve');
    expect(() => xformer.apply(inEl)).to.throw();
  });

  it('Moves attribute values out of the Carve namespace on unapply()', () => {
    inEl.setAttributeNS(CARVENS, 'carve:width', '5');

    const outEl = xformer.unapply(inEl);
    expect(outEl.hasAttributeNS(CARVENS, 'width')).is.false;
    expect(outEl.hasAttribute('width')).is.true;
    expect(outEl.getAttribute('width')).equals('5');
  });
});
