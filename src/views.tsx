/* @jsx svg */
import { svg } from 'sprotty/lib/lib/jsx';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { IView, RenderingContext } from 'sprotty';

@injectable()
export class TaskNodeView implements IView {
  render(node: any, context: RenderingContext): VNode {
    const position = 50;
    console.log('context: ', context)
    return <g>
        <rect class-sprotty-node={true} class-task={true}
            class-running={node.isRunning}
            class-finished={node.isFinished}
            width={node.size.width}
            height={node.size.height}
        >
        </rect>
        <text x={position} y={position + 5}>{node.name}</text>
    </g>;
  }
}
