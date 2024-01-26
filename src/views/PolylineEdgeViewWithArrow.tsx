/** @jsx svg */
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import {  PolylineEdgeView, RenderingContext, SEdgeImpl } from 'sprotty';
import { Point, toDegrees } from 'sprotty-protocol';
import { svg } from 'sprotty/lib/lib/jsx';

@injectable()
export class PolylineEdgeViewWithArrow extends PolylineEdgeView {
  protected override renderAdditionals(edge: SEdgeImpl, segments: Point[], context: RenderingContext): VNode[] {
      const p1 = segments[segments.length - 1];
      const p2 = segments[segments.length - 2];

      if(edge.selected) {
        console.log('PolylineEdgeViewWithArrow: ', edge)
      }


      return [
          <path class-arrowhead={true} 
            d="M 7,-3 L 0,0 L 7,3 Z"
            transform={`rotate(${this.angle(p1,p2)} ${p1.x} ${p1.y}) translate(${p1.x} ${p1.y})`}
          />
      ]
  }

  angle(x0: Point, x1: Point) {
    return toDegrees(Math.atan2(x1.y - x0.y, x1.x - x0.x));
  }
}