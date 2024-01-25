/** @jsx svg */
import { svg } from 'sprotty/lib/lib/jsx';

import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { ATTR_BBOX_ELEMENT, RenderingContext, setAttr, ShapeView, SPortImpl } from 'sprotty';


@injectable()
export class PortViewWithExternalLabel extends ShapeView {
    render(node: Readonly<SPortImpl>, context: RenderingContext): VNode | undefined {
        console.log('PortViewWithExternalLabel: ', node)
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const bboxElement = <rect
            class-sprotty-port={true}
            class-mouseover={node.hoverFeedback} class-selected={node.selected}
            x="0" y="0" width={Math.max(node.size.width, 0)} height={Math.max(node.size.height, 0)}>
        </rect>;
        setAttr(bboxElement, ATTR_BBOX_ELEMENT, true);

        return <g>
            {bboxElement}
            {context.renderChildren(node)}
        </g>;
    }
}
