export class TransformationPipeline {
    transformers;
    constructor(transformers) {
        this.transformers = transformers;
    }
    apply(doc) {
        let svgElem = doc;
        for (let i = 0; i < this.transformers.length; ++i) {
            svgElem = this.transformers[i].apply(svgElem);
        }
        return svgElem;
    }
    unapply(doc) {
        let svgElem = doc;
        for (let i = this.transformers.length - 1; i >= 0; --i) {
            svgElem = this.transformers[i].unapply(svgElem);
        }
        return svgElem;
    }
}
//# sourceMappingURL=transformer.js.map