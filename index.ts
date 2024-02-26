import "reflect-metadata";
import { LocalModelSource, MouseListener, SEdgeImpl, SModelElementImpl, SRoutingHandleImpl, TYPES } from 'sprotty';
import { Action } from "sprotty-protocol";
import { createContainer } from './di.config';
import { graph } from './model-source';

// utils
import addNode from "./util/addNode";
import drawEdge from "./util/drawEdge";


// elements dom
let addNode1Btn = null;
let addNode2Btn = null;
let addNode3Btn = null;
let addNode4Btn = null;
let drawEdgeBtn = null;
let cancelDrawEdgeBtn = null;
let deleteBtn = null;
let dummyNodeBtn = null;

// count of nodes
let node1Number = 1;
let node2Number = 1;
let node3Number = 1;
let node4Number = 1;

// count of labels
let label1Number = 1;
let label2Number = 1;
let label3Number = 1;
let label4Number = 1;

// count of edges
let edgeNumber = 1;

// dummy
let edgeArr = [];
let dummyNodeArray = [];

// size nodes & ports
const defaultNodeWidth = 100;
const defaultNodeHeight = 100;
const defaultPortWidth = 20;
const defaultPortHeight = 20;
const defaultDummyWidth = 10;
const defaultDummyHeight = 10;

// state of draw edge
let drawMode = true;

// source
let sourceId = null;

export class CustomMouseListener extends MouseListener {
  mouseUp(
    target: SModelElementImpl,
    event: MouseEvent
  ): (Action | Promise<Action>)[] {
    if (target instanceof SRoutingHandleImpl) {
      const targetParentEl = target.parent as SEdgeImpl;
      if (!targetParentEl.targetId.includes("dummy")) {
        setTimeout(() => {
          document.getElementById("cancel-draw-edge").click();
          const indexEdge = edgeArr.findIndex((edge) => {
            return edge.id === targetParentEl.id;
          });
          if (indexEdge !== -1) {
            edgeArr[indexEdge].sourceId = targetParentEl.sourceId;
            edgeArr[indexEdge].targetId = targetParentEl.targetId;
          }
        }, 100);
      }
    }
    return [];
  }

  override drop(target: SModelElementImpl, event: MouseEvent): (Action | Promise<Action>)[] {
    const customEvent = new CustomEvent('addDummyNode', { detail: { x: event.offsetX, y: event.offsetY } });
    document.getElementById("add-dummy-node").dispatchEvent(customEvent);
    return [];
  }

}

const container = createContainer("sprotty-container");
const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

// cancel draw edge
function cancelDrawEdge() {
  addNode1Btn.removeAttribute('disabled');
  addNode2Btn.removeAttribute('disabled');
  addNode3Btn.removeAttribute('disabled');
  addNode4Btn.removeAttribute('disabled');
  deleteBtn.removeAttribute('disabled');

  drawEdgeBtn.classList.remove("btn-active");
  cancelDrawEdgeBtn.classList.add('hide');

  document.querySelectorAll(".sprotty-node").forEach((e) => {
    (e as HTMLElement).removeAttribute("style");
  });

  document.querySelectorAll(".sprotty-edge").forEach((e)=>{
    (e as HTMLElement).classList.remove("selected");
  })

  modelSource.removeElements([
    {
      elementId: dummyNodeArray[0],
      parentId: "graph",
    },
  ]);

  const coordinateCircleArr = [];
  const cirlceEl = document.querySelectorAll(".sprotty-routing-handle");
  cirlceEl.forEach((e) => {
    coordinateCircleArr.push({
      x: e.getAttribute("cx"),
      y: e.getAttribute("cy"),
    });
  });

  const dummyNodeEl = document.getElementById("sprotty-container_node-dummy");
 
  if (dummyNodeEl) {
    const dummyCoordinate = dummyNodeEl
      .getAttribute("transform")
      .replace("translate(", "")
      .replace(")", "")
      .trim()
      .split(",")
      .map((e) => {
        return Number(e);
      });

      console.log('dummyNodeEl: ', {
        dummyNodeEl,
        edgeArr,
        coordinateCircleArr
      })
    if (coordinateCircleArr.length === 0) {
      modelSource.removeElements([
        {
          elementId: edgeArr[edgeArr.length - 1].id,
          parentId: "graph",
        },
      ]);
      edgeArr.pop();
    } else {
      if (
        Math.sqrt(
          Math.pow(
            Number(
              dummyCoordinate[0] -
                Number(coordinateCircleArr[coordinateCircleArr.length - 1].x)
            ),
            2
          ) +
            Math.pow(
              Number(
                dummyCoordinate[1] -
                  Number(coordinateCircleArr[coordinateCircleArr.length - 1].y)
              ),
              2
            )
        ) < 13
      ) {

        modelSource.removeElements([
          {
            elementId: edgeArr[edgeArr.length - 1].id,
            parentId: "graph",
          },
        ]);
        edgeArr.pop();
      }
    }
  }

  Array.from(document.getElementsByClassName("ready-draw")).forEach((e) => {
    e.classList.remove("ready-draw");
  });

  dummyNodeArray = [];
  sourceId = "";
  drawMode = true;
}

export default function run() {
  modelSource.setModel(graph);
  
  // elements dom
  addNode1Btn = document.getElementById('add-node-1');
  addNode2Btn = document.getElementById('add-node-2');
  addNode3Btn = document.getElementById('add-node-3');
  addNode4Btn = document.getElementById('add-node-4');
  drawEdgeBtn = document.getElementById('draw-edge');
  deleteBtn = document.getElementById('delete');
  cancelDrawEdgeBtn = document.getElementById('cancel-draw-edge');

  // for drag to create node
  dummyNodeBtn = document.getElementById('add-dummy-node');
  dummyNodeBtn.addEventListener('addDummyNode', (e: any) => {
    const x = e.detail.x;
    const y = e.detail.y;
    addNode({
      source: modelSource,
      nodeId: `dummy-${node1Number}`,
      labelId: "dummy",
      nodeWidth: 5,
      nodeHeight: 5,
      portWidth: 2,
      portHeight: 2,
      portQuantity: 1,
      cssClasses: ["nodes", "dummy"],
      name: '',
      x: x,
      y: y
    });
    node1Number++;
    dummyNodeArray.push("node-dummy");
  })

  // cancel draw edge
  cancelDrawEdgeBtn.addEventListener('click', () => {
    if(drawMode) {
      cancelDrawEdge();
    }
  })

  // draw edge
  function drawLogic() {
    setTimeout(() => {
      document.querySelectorAll('.port').forEach((port) => {
        port.addEventListener('click', (e) => {
          if(drawMode) {
            port.classList.add("ready-draw");
            sourceId = port.id.replace("sprotty-container_port-", "");
            const transformAttribute = port.parentElement.getAttribute("transform");
            const coordinate = transformAttribute
            ? transformAttribute
              .replace("translate(", "")
              .replace(")", "")
              .trim()
              .split(",")
            : [0, 0];
            // add dummy node
            if(dummyNodeArray.length == 0) {
              addNode({
                source: modelSource,
                nodeId: "dummy",
                labelId: "dummy",
                nodeWidth: defaultDummyWidth,
                nodeHeight: defaultDummyHeight,
                portWidth: 2,
                portHeight: 2,
                portQuantity: 1,
                cssClasses: ["nodes", "dummy"],
                name: '',
                x: Number(coordinate[0]) + 2 * defaultNodeWidth,
                y: Number(coordinate[1])
              });
              dummyNodeArray.push("node-dummy");
              drawEdge({
                source: modelSource,
                edgeId: edgeNumber,
                sourceNumb: sourceId,
                targetNumb: "dummy-1",
                cssClasses: ['dummy-edge']
              })
              edgeArr.push({
                id: `edge-${edgeNumber}`,
                sourceId: `port-${sourceId}`,
                targetId: "dummy-1",
              });
              edgeNumber++;
            }
          }
        })
      })
    }, 100)
  }

  // add node 1
  addNode1Btn.addEventListener('click', () => {
    addNode({
      source: modelSource,
      nodeId: `type-1-${node1Number}`,
      labelId: label1Number,
      nodeWidth: defaultNodeWidth,
      nodeHeight: defaultNodeHeight,
      portWidth: defaultPortWidth,
      portHeight: defaultPortHeight,
      portQuantity: 1
    });

    node1Number++;
    label1Number++;
    // draw edge
    drawLogic();
  });

  // add node 2
  addNode2Btn.addEventListener('click', () => {
    addNode({
      source: modelSource,
      nodeId: `type-2-${node2Number}`,
      labelId: label2Number,
      nodeWidth: defaultNodeWidth,
      nodeHeight: defaultNodeHeight,
      portWidth: defaultPortWidth,
      portHeight: defaultPortHeight,
      portQuantity: 2
    });

    node2Number++;
    label2Number++;
    // draw edge
    drawLogic();
  });

  // add node 3
  addNode3Btn.addEventListener('click', () => {
    addNode({
      source: modelSource,
      nodeId: `type-3-${node3Number}`,
      labelId: label3Number,
      nodeWidth: defaultNodeWidth,
      nodeHeight: defaultNodeHeight,
      portWidth: defaultPortWidth,
      portHeight: defaultPortHeight,
      portQuantity: 3
    });

    node3Number++;
    label3Number++;

    // draw edge
    drawLogic();
  });

   // add node 4
   addNode4Btn.addEventListener('click', () => {
    addNode({
      source: modelSource,
      nodeId: `type-4-${node4Number}`,
      labelId: label4Number,
      nodeWidth: defaultNodeWidth,
      nodeHeight: defaultNodeHeight,
      portWidth: defaultPortWidth,
      portHeight: defaultPortHeight,
      portQuantity: 4
    });

    node4Number++;
    label4Number++;

    // draw edge
    drawLogic();
  });

  // draw edge
  drawEdgeBtn.addEventListener('click', () => {
    if(!drawMode) {
      addNode1Btn.setAttribute('disabled', 'true');
      addNode2Btn.setAttribute('disabled', 'true');
      addNode3Btn.setAttribute('disabled', 'true');
      addNode4Btn.setAttribute('disabled', 'true');
      deleteBtn.setAttribute('disabled', 'true');

      drawEdgeBtn.classList.add("btn-active");
      cancelDrawEdgeBtn.classList.remove('hide');

      drawMode = true;
    } else {
      cancelDrawEdge();
    }
  })

  deleteBtn.addEventListener("click", () => {
    const selectedElements = document.querySelectorAll(".selected");
    selectedElements.forEach((element) => {
      if (element.id.includes("label") || element.id === "") {
        return;
      }
      modelSource.removeElements([
        {
          parentId: "graph",
          elementId: element.id.replace("sprotty-container_", ""),
        },
      ]);
      const idNodeCompare = element.id.replace(
        "sprotty-container_node-type-",
        ""
      );
      edgeArr.forEach((edge) => {
        const edgeSourceIdCompare = edge.sourceId.replace("port-type-", "");
        const edgeTargetIdCompare = edge.targetId.replace("port-type-", "");
        if (
          edgeSourceIdCompare.includes(idNodeCompare) ||
          edgeTargetIdCompare.includes(idNodeCompare)
        ) {
          modelSource.removeElements([
            {
              parentId: "graph",
              elementId: edge.id,
            },
          ]);
          const edgeIndex = edgeArr.findIndex((e) => {
            return e.id === edge.id;
          });
          edgeArr.splice(edgeIndex, 1);
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => run());