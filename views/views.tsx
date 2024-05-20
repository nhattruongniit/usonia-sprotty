/** @jsx svg */
import { svg } from "sprotty/lib/lib/jsx";
import { injectable } from "inversify";
import { VNode } from "snabbdom";
import {
  IView,
  RenderingContext,
  SEdgeImpl,
  PolylineEdgeView,
  RectangularNodeView,
  SNodeImpl,
  IViewArgs,
  SLabelImpl,
  SModelElementImpl,
  SButtonImpl,
} from "sprotty";

import { Point, toDegrees } from "sprotty-protocol";

@injectable()
export class EdgeWithArrow extends PolylineEdgeView {
  protected override renderAdditionals(
    edge: SEdgeImpl,
    segments: Point[],
    context: RenderingContext,
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
export class PropertyLabel extends SLabelImpl {}

@injectable()
export class NodeView extends RectangularNodeView {
  override render(
    node: Readonly<SNodeImpl>,
    context: RenderingContext,
    args?: IViewArgs,
  ): VNode | undefined {
    if (!this.isVisible(node, context)) {
      return undefined;
    }
    return (
      <g>
        <rect
          class-sprotty-node={true}
          class-node-package={node.type === "node:package"}
          class-node-class={node.type === "node:class"}
          class-mouseover={node.hoverFeedback}
          class-selected={node.selected}
          x="0"
          y="0"
          width={Math.max(node.size.width, 0)}
          height={Math.max(node.size.height, 0)}
        ></rect>
        {context.renderChildren(node)}
      </g>
    );
  }
}
