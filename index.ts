import "reflect-metadata";
import { LocalModelSource, TYPES } from 'sprotty';
import { createContainer } from './di.config';
import { graph } from './model-source';

// utils
import addNode from "./util/addNode";
import drawEdge from "./util/drawEdge";

const container = createContainer("sprotty-container");
const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

// elements dom
let addNode1Btn = null;
let addNode2Btn = null;
let addNode3Btn = null;
let addNode4Btn = null;
let drawEdgeBtn = null;
let cancelDrawEdgeBtn = null;
let deleteBtn = null;

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
let dummyNodeArray = [];
let edgeIdArray = [];

// size nodes & ports
const defaultNodeWidth = 100;
const defaultNodeHeight = 100;
const defaultPortWidth = 20;
const defaultPortHeight = 20;
const defaultDummyWidth = 1;
const defaultDummyHeight = 1;

// state of draw edge
let drawMode = false;

// source
let sourceId = null;

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
    if (coordinateCircleArr.length === 0) {
      modelSource.removeElements([
        {
          elementId: edgeIdArray[edgeIdArray.length - 1],
          parentId: "graph",
        },
      ]);
      edgeIdArray = [];
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
        ) < 7
      ) {
        modelSource.removeElements([
          {
            elementId: edgeIdArray[edgeIdArray.length - 1],
            parentId: "graph",
          },
        ]);
        edgeIdArray = [];
      }
    }
  }

  Array.from(document.getElementsByClassName("ready-draw")).forEach((e) => {
    e.classList.remove("ready-draw");
  });
  dummyNodeArray = [];

  sourceId = "";
  drawMode = false;
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
              edgeIdArray.push(`edge-${edgeNumber}`);
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


  // cancel draw edge
  cancelDrawEdgeBtn.addEventListener('click', () => {
    if(drawMode) {
      cancelDrawEdge();
    }
  })

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

  // delete edge
  // deletetn.addEventListener('click', () => {
  //   const edgeElements = document.querySelectorAll(".sprotty-edge");
  //   const selectedEdgeElements = Array.from(edgeElements).filter((e) => {
  //     return e.classList.contains("selected");
  //   });
  //   selectedEdgeElements.forEach((element) => {
  //     modelSource.removeElements([
  //       {
  //         parentId: "graph",
  //         elementId: element.id.replace("sprotty-container_", ""),
  //       },
  //     ]);
  //   });
  // })

  deleteBtn.addEventListener("click", () => {
    const selectedElements = document.querySelectorAll(".selected");
    selectedElements.forEach((element) => {
      modelSource.removeElements([
        {
          parentId: "graph",
          elementId: element.id.replace("sprotty-container_", ""),
        },
      ]);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => run());