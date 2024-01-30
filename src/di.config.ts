import { Container, ContainerModule } from 'inversify';
import { 
    configureModelElement, configureViewerOptions, loadDefaultModules, LocalModelSource, 
    SEdgeImpl, SGraphImpl, SGraphView, SNodeImpl, TYPES, SLabelView, SLabelImpl, SPortImpl,
    edgeIntersectionModule,
    JumpingPolylineEdgeView,
    SRoutingHandleImpl,
    SRoutingHandleView,
    BezierCurveEdgeView,
    SBezierCreateHandleView,
    SBezierControlHandleView,
    PolylineEdgeViewWithGapsOnIntersections,
} from 'sprotty';
import { SGraph, SModelIndex, SNode, SPort } from 'sprotty-protocol';
import ElkConstructor, { LayoutOptions } from 'elkjs/lib/elk.bundled';
import {
    DefaultLayoutConfigurator, ElkFactory, ElkLayoutEngine, elkLayoutModule, ILayoutConfigurator
} from 'sprotty-elk/lib/inversify';

// views
import { TaskNodeView } from './views/TaskNodeManual';
// import { PolylineEdgeViewWithArrow } from './views/PolylineEdgeViewWithArrow';
import { PortViewWithExternalLabel } from './views/PortViewWithExternalLabel';
// import { RectangularNodeView } from './views/RectangularNodeView';
import { DummyNodeView } from './views/DummyNode';
import { DummyPortView } from './views/DummyPort';

export const createContainer = (containerId: string) => {

    const elkFactory: ElkFactory = () => new ElkConstructor({
        algorithms: ['layered']
    });

    const myModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();
        bind(TYPES.IModelLayoutEngine).toService(ElkLayoutEngine);
        bind(ElkFactory).toConstantValue(elkFactory);
        bind(RandomGraphLayoutConfigurator).toSelf().inSingletonScope();
        rebind(ILayoutConfigurator).to(RandomGraphLayoutConfigurator).inSingletonScope();


        const context = { bind, unbind, isBound, rebind };
        configureModelElement(context, 'graph', SGraphImpl, SGraphView);
        configureModelElement(context, 'node', SNodeImpl, TaskNodeView);
        configureModelElement(context, 'node:dummy', SNodeImpl, DummyNodeView);
        configureModelElement(context, 'port', SPortImpl, PortViewWithExternalLabel);
        configureModelElement(context, 'port:dummy', SPortImpl, DummyPortView);
      
        configureModelElement(context, 'edge', SEdgeImpl, PolylineEdgeViewWithGapsOnIntersections);
        configureModelElement(context, 'edge:straight', SEdgeImpl, JumpingPolylineEdgeView);
        configureModelElement(context, 'routing-point', SRoutingHandleImpl, SRoutingHandleView);
        configureModelElement(context, 'volatile-routing-point', SRoutingHandleImpl, SRoutingHandleView);

        configureModelElement(context, 'edge:bezier', SEdgeImpl, BezierCurveEdgeView);
        configureModelElement(context, 'bezier-create-routing-point', SRoutingHandleImpl, SBezierCreateHandleView);
        configureModelElement(context, 'bezier-remove-routing-point', SRoutingHandleImpl, SBezierCreateHandleView);
        configureModelElement(context, 'bezier-routing-point', SRoutingHandleImpl, SBezierControlHandleView);

        configureModelElement(context, 'label:node', SLabelImpl, SLabelView);
        configureModelElement(context, 'label:port', SLabelImpl, SLabelView);

        configureViewerOptions(context, {
            needsClientLayout: true,
            baseDiv: containerId
        });
    });

    const container = new Container();
    loadDefaultModules(container);
    // container.load(myModule);

    container.load(edgeIntersectionModule);
    container.load(elkLayoutModule, myModule);
    return container;
};


export class RandomGraphLayoutConfigurator extends DefaultLayoutConfigurator {

    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'LEFT';

    public setDirection(direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): void {
        this.direction = direction;
    }

    protected override graphOptions(sgraph: SGraph, index: SModelIndex): LayoutOptions | undefined {
        return {
            'org.eclipse.elk.algorithm': 'org.eclipse.elk.layered',
            'elk.direction': this.direction
        };
    }

    protected override nodeOptions(snode: SNode, index: SModelIndex): LayoutOptions | undefined {
        return {
            'org.eclipse.elk.nodeSize.constraints': 'PORTS PORT_LABELS NODE_LABELS MINIMUM_SIZE',
            'org.eclipse.elk.nodeSize.minimum': '(40, 40)',
            'org.eclipse.elk.portConstraints': 'FREE',
            'org.eclipse.elk.nodeLabels.placement': 'INSIDE H_CENTER V_TOP',
            'org.eclipse.elk.portLabels.placement': 'OUTSIDE'
        };
    }

    protected override portOptions(sport: SPort, index: SModelIndex): LayoutOptions | undefined {
        return {
            'org.eclipse.elk.port.borderOffset': '1'
        };
    }

}