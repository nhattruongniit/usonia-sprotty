/* @jsx svg */
import { svg } from 'sprotty/lib/lib/jsx';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { Hoverable, IView, IViewArgs, RenderingContext, SNodeImpl, SPortImpl, SShapeElementImpl, Selectable, ShapeView } from 'sprotty';

@injectable()
export class RectangularNodeView extends ShapeView {
  render(node: any, context: RenderingContext, args?: IViewArgs): VNode | undefined {
      if (!this.isVisible(node, context)) {
          return undefined;
      }
      return <g>
          <rect class-sprotty-node={node instanceof SNodeImpl} class-sprotty-port={node instanceof SPortImpl}
                class-mouseover={node.hoverFeedback} class-selected={node.selected} class-running={node.isRunning}
                class-finished={node.isFinished}
                x="0" y="0" width={Math.max(node.size.width, 0)} height={Math.max(node.size.height, 0)}></rect>
          {context.renderChildren(node)}
      </g>;
  }
}

