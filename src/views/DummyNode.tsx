/* @jsx svg */
import { svg } from 'sprotty/lib/lib/jsx';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { IView, RenderingContext } from 'sprotty';

@injectable()
export class DummyNodeView implements IView {
  render(node: any, context: RenderingContext): VNode {
    return (
      <g>
        <rect 
          class-sprotty-node={true} 
          class-task={true}
          class-elknode={true}
          width={node.size.width}
          height={node.size.height}
        />
      </g>
    )
  }
}
