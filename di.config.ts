import { Container, ContainerModule } from "inversify";
import {
  BezierCurveEdgeView,
  configureModelElement,
  configureViewerOptions,
  loadDefaultModules,
  LocalModelSource,
  PolylineEdgeView,
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
  RectangularNode,
  moveFeature,
  selectFeature,
  SButtonImpl,
  ExpandButtonView,
  configureButtonHandler,
  IModelFactory,
  ViewportRootElementImpl,
  SetViewportCommand,
  CommandExecutionContext,
  ConsoleLogger,
  AnimationFrameSyncer,
  registerModelElement,
  PreRenderedView,
  ShapedPreRenderedElementImpl,
} from "sprotty";

import { Viewport, SetViewportAction } from "sprotty-protocol";

import { PortViewWithExternalLabel } from "./views/PortViewWithExternalLabel";
import { CustomMouseListener, CustomButtonHandler } from "./index";
import {
  EdgeWithArrow,
  NodeView,
  PropertyLabel,
  customButtonView,
} from "./views/views";

export const createContainer = (containerId: string) => {
  const myModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    // mouse event
    bind(CustomMouseListener).toSelf().inSingletonScope();
    bind(TYPES.MouseListener).toService(CustomMouseListener);

    bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, "graph", SGraphImpl, SGraphView);
    configureModelElement(context, 'pre-rendered', ShapedPreRenderedElementImpl, PreRenderedView);

    configureModelElement(
      context,
      "button:custom",
      SButtonImpl,
      customButtonView,
      {
        disable: [moveFeature],
      }
    );

    configureButtonHandler(
      { bind, isBound },
      "button:custom",
      CustomButtonHandler
    );
    configureModelElement(context, "node:package", RectangularNode, NodeView);
    configureModelElement(
      context,
      "port",
      SPortImpl,
      PortViewWithExternalLabel
    );
    configureModelElement(container, "label:port", SLabelImpl, SLabelView);
    configureModelElement(container, "label:node", SLabelImpl, SLabelView);
    configureModelElement(container, "label:edge", SLabelImpl, SLabelView);
    configureModelElement(context, "label:text", PropertyLabel, SLabelView, {
      enable: [moveFeature, selectFeature],
    });
    configureModelElement(context, "node", SNodeImpl, RectangularNodeView);
    configureModelElement(context, "edge", SEdgeImpl, EdgeWithArrow);
    configureModelElement(
      context,
      "edge:straight",
      SEdgeImpl,
      PolylineEdgeView
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
