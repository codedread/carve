import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { DeleteElementsCommand } from './delete-elements-command.js';
describe('DeleteElementsCommand tests', () => {
    const fakeElem = {
        parentElement: {
            insertBefore: sinon.fake(),
            removeChild: sinon.fake(),
        },
        nextElementSibling: {},
    };
    let cmd = null;
    beforeEach(() => {
        fakeElem.parentElement.insertBefore.resetHistory();
        fakeElem.parentElement.removeChild.resetHistory();
        cmd = new DeleteElementsCommand(fakeElem);
    });
    it('applies properly', () => {
        cmd.apply(null);
        // Ensure that parentElem had removeChild() called properly.
        const removeChildCall = fakeElem.parentElement.removeChild;
        expect(removeChildCall.calledOnce).true;
        expect(removeChildCall.calledWith(fakeElem)).true;
    });
    it('unapplies properly', () => {
        cmd.unapply(null);
        // Ensure that parentElem had insertBefore() called properly.
        const insertBeforeCall = fakeElem.parentElement.insertBefore;
        expect(insertBeforeCall.calledOnce).true;
        expect(insertBeforeCall.calledWith(fakeElem, fakeElem.nextElementSibling)).true;
    });
});
//# sourceMappingURL=delete-elements-command.test.js.map