import { Container, ContainerModule } from "inversify";
import {
  BezierCurveEdgeView,
  configureModelElement,
  configureViewerOptions,
  loadDefaultModules,
  LocalModelSource,
  PolylineEdgeView,
  EdgeWithArrow,
  RectangularNodeView,
  SBezierControlHandleView,
  SBezierCreateHandleView,
  SEdgeImpl,
  SGraphImpl,
  SGraphView,
  SLabelImpl,
  SLabelView,
  SNodeImpl,
  SPortImpl,
  SRoutingHandleImpl,
  SRoutingHandleView,
  TYPES,
} from "sprotty";

import { PortViewWithExternalLabel } from "./views/PortViewWithExternalLabel";
import { CustomMouseListener } from "./index";

export const createContainer = (containerId: string) => {
  const myModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    // mouse event
    bind(CustomMouseListener).toSelf().inSingletonScope();
    bind(TYPES.MouseListener).toService(CustomMouseListener);

    bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, "graph", SGraphImpl, SGraphView);
    configureModelElement(
      context,
      "port",
      SPortImpl,
      PortViewWithExternalLabel
    );
    configureModelElement(container, "label:port", SLabelImpl, SLabelView);
    configureModelElement(container, "label:node", SLabelImpl, SLabelView);
    configureModelElement(context, "node", SNodeImpl, RectangularNodeView);
    configureModelElement(context, "edge", SEdgeImpl, EdgeWithArrow);
    // configureModelElement(
    //   context,
    //   "edge:straight",
    //   SEdgeImpl,
    //   PolylineEdgeView
    // );

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
