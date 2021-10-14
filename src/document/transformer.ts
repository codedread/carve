export interface Transformer {
  apply(doc: SVGSVGElement): SVGSVGElement;
  unapply(doc: SVGSVGElement): SVGSVGElement;
}

export class TransformationPipeline implements Transformer {
  constructor(private transformers: Transformer[]) {}

  apply(doc: SVGSVGElement): SVGSVGElement {
    let svgElem = doc;
    for (let i = 0; i < this.transformers.length; ++i) {
      svgElem = this.transformers[i].apply(svgElem);
    }
    return svgElem;
  }

  unapply(doc: SVGSVGElement): SVGSVGElement {
    let svgElem = doc;
    for (let i = this.transformers.length - 1; i >= 0; --i) {
      svgElem = this.transformers[i].unapply(svgElem);
    }
    return svgElem;
  }
}
