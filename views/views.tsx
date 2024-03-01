/** @jsx svg */
import { svg } from "sprotty/lib/lib/jsx";
import { injectable } from "inversify";
import { VNode } from "snabbdom";
import { IView, RenderingContext, SEdgeImpl } from "sprotty";
import { toDegrees } from "../util/math";
import { Point } from "sprotty-protocol";

@injectable()
export class TaskNodeView implements IView {
  render(node: any, context: RenderingContext): VNode {
    const position = 50;
    return (
      <g>
        <rect
          class-sprotty-node={true}
          class-task={true}
          class-running={node.isRunning}
          class-finished={node.isFinished}
          width={node.size.width}
          height={node.size.height}
        ></rect>
        <text x={position} y={position + 5}>
          {node.name}
        </text>
      </g>
    );
  }
}

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
