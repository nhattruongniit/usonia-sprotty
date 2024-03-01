import { PolylineEdgeView, SEdgeImpl, RenderingContext } from "sprotty";
import { Point, toDegrees } from "sprotty-protocol";
import { injectable } from "inversify";
import { VNode } from "snabbdom";

@injectable()
export class EdgeWithArrow extends PolylineEdgeView {
  protected override renderAdditionals(
    edge: SEdgeImpl,
    segments: Point[],
    context: RenderingContext
  ): VNode[] {
    const p1 = segments[segments.length - 1];
    const p2 = segments[segments.length - 2];

    return [
      <path
        class-arrowhead={true}
        d="M 10, -5 L 0, 0 L 10, 5 z"
        transform={`rotate(${this.angle(p1, p2)} ${p1.x} ${p1.y}) translate(${
          p1.x
        } ${p1.y})`}
      ></path>,
    ];
  }

  angle(x0: Point, x1: Point): number {
    return toDegrees(Math.atan2(x1.y - x0.y, x1.x - x0.x));
  }
}
