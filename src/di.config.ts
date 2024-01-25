import { Container, ContainerModule } from 'inversify';
import { 
    configureModelElement, configureViewerOptions, loadDefaultModules, LocalModelSource, 
    SEdgeImpl, SGraphImpl, SGraphView, SNodeImpl, TYPES, SLabelView, SLabelImpl, SPortImpl, ConsoleLogger, LogLevel, UpdateModelCommand, edgeIntersectionModule, PolylineEdgeViewWithGapsOnIntersections
} from 'sprotty';
import ElkConstructor from 'elkjs/lib/elk.bundled';

import {
    DefaultLayoutConfigurator, ElkFactory, ElkLayoutEngine, elkLayoutModule, ILayoutConfigurator
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
        bind(TYPES.IModelLayoutEngine).toService(ElkLayoutEngine);
        bind(ElkFactory).toConstantValue(elkFactory);
        // rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
        // rebind(TYPES.LogLevel).toConstantValue(LogLevel.log);
        // rebind(UpdateModelCommand).to(TrackSelectedUpdateModelCommand);

        const context = { bind, unbind, isBound, rebind };
        configureModelElement(container, 'graph', SGraphImpl, SGraphView);
        configureModelElement(container, 'node', SNodeImpl, TaskNodeView);
        configureModelElement(container, 'port', SPortImpl, PortViewWithExternalLabel);
        configureModelElement(container, 'edge', SEdgeImpl, PolylineEdgeViewWithArrow);

        configureModelElement(container, 'label:node', SLabelImpl, SLabelView);
        configureModelElement(container, 'label:port', SLabelImpl, SLabelView);

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