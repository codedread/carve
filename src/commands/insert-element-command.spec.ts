import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { EditorHost } from '../editor-host.js';
import { InsertElementCommand } from './insert-element-command.js';

describe('InsertElementCommand tests', () => {

  /* The editor image's <svg> element. */
  const fakeImageEl = {
    appendChild: sinon.spy(),
    removeChild: sinon.spy(),
  };

  /* The EditorHost fake. */
  let fakeEditorHost: EditorHost = {
    addEventListener() {},
    commandExecute() {},
    commandReexecute() { },
    commandUnexecute() { },
    getImage() { return fakeImageEl as any as SVGSVGElement; },
    getOverlay() { return null; },
    getSelection() { return null; },
    switchDocument() { },
  };

  let cmd: InsertElementCommand = null;

  describe('Insert new element', () => {
    // New element with no previous parent or next sibling.
    const fakeElem = {
      parentElement: null,
      nextElementSibling: null,
    };

    beforeEach(() => {
      fakeImageEl.appendChild.resetHistory();
      fakeImageEl.removeChild.resetHistory();
      cmd = new InsertElementCommand(fakeElem as any as SVGGraphicsElement);
    });

    it('apply() insert properly into the image', () => {
      cmd.apply(fakeEditorHost);
      expect(fakeImageEl.appendChild.calledOnce).is.true;
    });

    it('unapply() removes properly from the image', () => {
      cmd.unapply(fakeEditorHost);
      expect(fakeImageEl.removeChild.calledOnce).is.true;
    });
  });

  describe('Insert element into a new position', () => {
    // Old parent.
    const fakeOldParent = {
      insertBefore: sinon.fake(),
    };

    // Old next sibling.
    const fakeOldNextSibling = { id: 'old-next-sibling' };

    // Element being moved within the image.
    const fakeElem = {
      parentElement: fakeOldParent,
      nextElementSibling: fakeOldNextSibling,
    };

    const fakeNewParent = {
      insertBefore: sinon.fake(),
    };
    const fakeNewNextSibling = { id: 'new-next-sibling' };

    beforeEach(() => {
      fakeImageEl.appendChild.resetHistory();
      fakeImageEl.removeChild.resetHistory();
      fakeOldParent.insertBefore.resetHistory();
      fakeNewParent.insertBefore.resetHistory();

      cmd = new InsertElementCommand(fakeElem as any as SVGGraphicsElement,
          fakeNewParent as any as SVGElement,
          fakeNewNextSibling as any as SVGElement);
    });

    it('apply() insert properly into the new parent', () => {
      cmd.apply(fakeEditorHost);
      const insertBeforeCall = fakeNewParent.insertBefore;
      expect(insertBeforeCall.calledOnce).is.true;
      expect(insertBeforeCall.calledWith(fakeElem, fakeNewNextSibling)).is.true;
    });

    it('unapply() inserts properly into the old parent', () => {
      cmd.unapply(fakeEditorHost);
      const insertBeforeCall = fakeOldParent.insertBefore;
      expect(insertBeforeCall.calledOnce).is.true;
      expect(insertBeforeCall.calledWith(fakeElem, fakeOldNextSibling)).is.true;
    });
  });
});
