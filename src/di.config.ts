import { Container, ContainerModule } from "inversify";
import {
  configureModelElement,
  configureViewerOptions,
  creatingOnDragFeature,
  deletableFeature,
  JumpingPolylineEdgeView,
  loadDefaultModules,
  LocalModelSource,
  moveFeature,
  PolylineEdgeView,
  SEdgeImpl,
  SGraphImpl,
  SGraphView,
  SNodeImpl,
  TYPES,
  viewportFeature,
  SRoutingHandleImpl,
  SRoutingHandleView,
  BezierCurveEdgeView,
  SBezierControlHandleView,
  SBezierCreateHandleView,
  SPortImpl,
} from "sprotty";
import { TaskNodeView } from "./views/TaskNodeView";
import { CreatingOnDrag } from "sprotty";


import { PortView } from "./views/PortView";

export const createContainer = (containerId: string) => {
  const myModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, "graph", SGraphImpl, SGraphView);
    // configureModelElement(context, "task", SNodeImpl, TaskNodeView);
    configureModelElement(context, "node", SNodeImpl, TaskNodeView);
    configureModelElement(context, 'port', SPortImpl, PortView);
    
    configureModelElement(
      context,
      "edge:straight",
      SEdgeImpl,
      PolylineEdgeView
    );
    configureModelElement(
      context,
      "edge:bezier",
      SEdgeImpl,
      BezierCurveEdgeView
    );
    configureModelElement(
      context,
      "routing-point",
      SRoutingHandleImpl,
      SRoutingHandleView
    );
    configureModelElement(
      context,
      "volatile-routing-point",
      SRoutingHandleImpl,
      SRoutingHandleView
    );
    configureModelElement(
      context,
      "bezier-create-routing-point",
      SRoutingHandleImpl,
      SBezierCreateHandleView
    );
    configureModelElement(
      context,
      "bezier-remove-routing-point",
      SRoutingHandleImpl,
      SBezierCreateHandleView
    );
    configureModelElement(
      context,
      "bezier-routing-point",
      SRoutingHandleImpl,
      SBezierControlHandleView
    );

    configureViewerOptions(context, {
      needsClientLayout: false,
      baseDiv: containerId,
    });
  });

  const container = new Container();
  loadDefaultModules(container);
  container.load(myModule);
  return container;
};
