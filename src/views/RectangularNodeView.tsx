/* @jsx svg */
import { svg } from 'sprotty/lib/lib/jsx';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { Hoverable, IView, IViewArgs, RenderingContext, SNodeImpl, SPortImpl, SShapeElementImpl, Selectable, ShapeView } from 'sprotty';

@injectable()
export class RectangularNodeView extends ShapeView {
  render(node: any, context: RenderingContext, args?: IViewArgs): VNode | undefined {
      const position = 50
      if (!this.isVisible(node, context)) {
          return undefined;
      }
      return (
        <g>
          <rect 
            class-sprotty-node={node instanceof SNodeImpl} class-sprotty-port={node instanceof SPortImpl}
            class-mouseover={node.hoverFeedback} class-selected={node.selected} class-running={node.isRunning}
            class-finished={node.isFinished}
            x="0" y="0" width={node.size.width}
            height={node.size.height}
          ></rect>
          <text x={position} y={position + 5}>
            {node.name}
          </text>
          {context.renderChildren(node)}
        </g>
      )
  }
}

