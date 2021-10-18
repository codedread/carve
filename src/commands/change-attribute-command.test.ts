import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { ChangeAttributeCommand } from './change-attribute-command.js';

describe('ChangeAttributeCommand tests', () => {

  const fakeElem = {
    removeAttribute: sinon.fake(),
    setAttribute: sinon.fake(),
  };

  let cmd: ChangeAttributeCommand = null;

  function resetFakes() {
    fakeElem.removeAttribute.resetHistory();
    fakeElem.setAttribute.resetHistory();
  }

  beforeEach(() => {
    resetFakes();
  });

  it('applies and unapplies properly when not previously set', () => {
    cmd = new ChangeAttributeCommand(fakeElem as unknown as SVGGraphicsElement, 'width', null, '4');
    cmd.apply(null);
    expect(fakeElem.setAttribute.calledOnce).true;
    expect(fakeElem.setAttribute.calledWith('width', '4'));
    resetFakes();

    cmd.unapply(null);
    expect(fakeElem.removeAttribute.calledOnce).true;
    expect(fakeElem.removeAttribute.calledWith('width'));
  });

  it('applies and unapplies properly when previously set', () => {
    cmd = new ChangeAttributeCommand(fakeElem as unknown as SVGGraphicsElement, 'width', '2', '4');
    cmd.apply(null);
    expect(fakeElem.setAttribute.calledOnce).true;
    expect(fakeElem.setAttribute.calledWith('width', '4'));
    resetFakes();

    cmd.unapply(null);
    expect(fakeElem.setAttribute.calledOnce).true;
    expect(fakeElem.setAttribute.calledWith('width', '2'));
  });
});
