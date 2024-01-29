import { Container, ContainerModule } from 'inversify';
import { 
    configureModelElement, configureViewerOptions, loadDefaultModules, LocalModelSource, 
    SEdgeImpl, SGraphImpl, SGraphView, SNodeImpl, TYPES, SLabelView, SLabelImpl, SPortImpl, ConsoleLogger, LogLevel,
    edgeIntersectionModule,
    selectFeature,
    hoverFeedbackFeature
} from 'sprotty';
import ElkConstructor from 'elkjs/lib/elk.bundled';

import { ElkFactory, ElkLayoutEngine, elkLayoutModule
} from 'sprotty-elk/lib/inversify';

// views
import { TaskNodeView } from './views/TaskNodeManual';
import { PolylineEdgeViewWithArrow } from './views/PolylineEdgeViewWithArrow';
import { PortViewWithExternalLabel } from './views/PortViewWithExternalLabel';
import { RectangularNodeView } from './views/RectangularNodeView';

export const createContainer = (containerId: string) => {

    const elkFactory: ElkFactory = () => new ElkConstructor({
        algorithms: ['layered']
    });

    const myModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();
        // bind(TYPES.IModelLayoutEngine).toService(ElkLayoutEngine);
        // bind(ElkFactory).toConstantValue(elkFactory);

        const context = { bind, unbind, isBound, rebind };
        configureModelElement(context, 'graph', SGraphImpl, SGraphView);
        configureModelElement(context, 'node', SNodeImpl, TaskNodeView);
        configureModelElement(context, 'port', SPortImpl, PortViewWithExternalLabel);
        configureModelElement(context, 'edge', SEdgeImpl, PolylineEdgeViewWithArrow, {
            enable: [selectFeature],
            disable: [hoverFeedbackFeature]
        });

        configureModelElement(context, 'label:node', SLabelImpl, SLabelView);
        configureModelElement(context, 'label:port', SLabelImpl, SLabelView);

        configureViewerOptions(context, {
            needsClientLayout: true,
            baseDiv: containerId
        });
    });

    const container = new Container();
    loadDefaultModules(container);
    container.load(myModule);

    // container.load(edgeIntersectionModule);
    // container.load(elkLayoutModule, myModule);
    return container;
};
