import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { TransformationPipeline, Transformer } from './transformer.js';

describe('Transformer tests', () => {
  describe('TransformationPipeline tests', () => {
    const xformers = [
      { apply: sinon.fake(), unapply: sinon.fake() },
      { apply: sinon.fake(), unapply: sinon.fake() },
      { apply: sinon.fake(), unapply: sinon.fake() },
    ];

    const pipeline: TransformationPipeline = new TransformationPipeline(xformers);

    beforeEach(() => {
      xformers.forEach(xformer => {
        xformer.apply.resetHistory();
        xformer.unapply.resetHistory();
      });
    });

    it('calls apply in the correct order', () => {
      pipeline.apply({} as SVGSVGElement);
      expect(xformers[0].apply.calledOnce).is.true;
      expect(xformers[1].apply.calledImmediatelyAfter(xformers[0].apply)).is.true;
      expect(xformers[2].apply.calledImmediatelyAfter(xformers[1].apply)).is.true;
    });

    it('calls unapply in the correct order', () => {
      pipeline.unapply({} as SVGSVGElement);
      expect(xformers[2].unapply.calledOnce).is.true;
      expect(xformers[1].unapply.calledImmediatelyAfter(xformers[2].unapply)).is.true;
      expect(xformers[0].unapply.calledImmediatelyAfter(xformers[1].unapply)).is.true;
    });
  });
});
