import { MouseListener, SEdgeImpl, SModelElementImpl, SRoutingHandleImpl } from "sprotty"
import { Action, Point } from "sprotty-protocol"
import { inject } from 'inversify';

const NodeCreator = Symbol('NodeCreator');

export class CustomMouseListener extends MouseListener {

  // @inject(NodeCreator) nodeCreator: (point?: Point) => void;
  
  mouseUp(target: SModelElementImpl, event: MouseEvent): (Action | Promise<Action>)[] {
    if (target instanceof SRoutingHandleImpl) {
      if (!(target.parent as SEdgeImpl).targetId.includes("dummy")) {
        setTimeout(() => {
          document.getElementById("cancel-draw-edge").click();
        }, 100)
      }
    }
    return [];
  }
  mouseDown(target: any, event: MouseEvent): (Action | Promise<Action>)[] {
    return [];
  }

  override dragOver(target: SModelElementImpl, event: MouseEvent): (Action | Promise<Action>)[] {
    event.preventDefault();
    return [];
  }

  override drop(target: SModelElementImpl, event: MouseEvent): (Action | Promise<Action>)[] {
    const customEvent = new CustomEvent('addDummyNode', { detail: { x: event.offsetX, y: event.offsetY } });
    document.getElementById("add-dummy-node").dispatchEvent(customEvent);
    return [];
  }
}
