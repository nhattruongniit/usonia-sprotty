import "reflect-metadata";
import {
  LocalModelSource,
  MouseListener,
  SEdgeImpl,
  SModelElementImpl,
  SNodeImpl,
  SRoutingHandleImpl,
  SelectMouseListener,
  TYPES,
} from "sprotty";
import { Action, Selectable } from "sprotty-protocol";
import { createContainer } from "./di.config";
import { graph } from "./model-source";

// utils
import addNode from "./util/addNode";
import drawEdge from "./util/drawEdge";
import checkIdElement from "./util/checkIdElement";
import randomText from "./util/randomText";
import getGrahpJson from "./util/getGraphJson";
import checkPositionEl from "./util/checkPositionEl";

// elements dom
let addParentNode = null;
let addNode1Btn = null;
let addNode2Btn = null;
let addNode3Btn = null;
let addNode4Btn = null;
let drawEdgeBtn = null;
let cancelDrawEdgeBtn = null;
let deleteBtn = null;
let dummyNodeBtn = null;
let showJsonBtn = null;
let exportJsonBtn = null;

// count of nodes

let nodeParentNumber =
  checkIdElement(graph).countIdNodeParent !== null
    ? checkIdElement(graph).countIdNodeParent
    : 1;
let node1Number =
  checkIdElement(graph).countIdNodeType1 !== null
    ? checkIdElement(graph).countIdNodeType1
    : 1;
let node2Number =
  checkIdElement(graph).countIdNodeType2 !== null
    ? checkIdElement(graph).countIdNodeType2
    : 1;
let node3Number =
  checkIdElement(graph).countIdNodeType3 !== null
    ? checkIdElement(graph).countIdNodeType3
    : 1;
let node4Number =
  checkIdElement(graph).countIdNodeType4 !== null
    ? checkIdElement(graph).countIdNodeType4
    : 1;

// count of edges
let edgeNumber =
  checkIdElement(graph).countIdEdge !== null
    ? checkIdElement(graph).countIdEdge
    : 1;

// dummy
let edgeArr = [];
let dummyNodeArray = [];
let dummyEdgeId = null;

// size nodes & ports
const defaultNodeParentWidth = 400;
const defaultNodeParentHeight = 400;
const defaultNodeWidth = 100;
const defaultNodeHeight = 100;
const defaultPortWidth = 20;
const defaultPortHeight = 20;
const defaultDummyWidth = 10;
const defaultDummyHeight = 10;

// state of draw edge
let drawMode = false;
let dummyMode = false;

// source
let sourceId = null;
let targetId = null;

// JSON resolve

//
export class CustomMouseListener extends MouseListener {
  mouseUp(target: any, event: MouseEvent): (Action | Promise<Action>)[] {
    // code connect by dummy node
    const objectCheck = checkPositionEl(
      target,
      defaultDummyWidth,
      defaultDummyHeight,
      defaultNodeWidth,
      defaultNodeHeight,
      defaultPortWidth,
      defaultPortHeight
    );
    if (objectCheck.isDrawable) {
      console.log(objectCheck);
      targetId = objectCheck.targetId;
      console.log("draw");
      drawEdge({
        source: modelSource,
        edgeId: edgeNumber,
        sourceNumb: sourceId,
        targetNumb: targetId.replace("port-", ""),
        type: "edge",
        cssClasses: ["dummy-edge"],
      });
      edgeArr.push({
        id: `edge-${edgeNumber}`,
        sourceId: `port-${sourceId}`,
        targetId: targetId,
      });
      edgeNumber++;
      cancelDrawEdge();
    }
    cancelDrawEdge();

    return [];
  }
  mouseMove(target: any, event: MouseEvent): (Action | Promise<Action>)[] {
    const objectCheck = checkPositionEl(
      target,
      defaultDummyWidth,
      defaultDummyHeight,
      defaultNodeWidth,
      defaultNodeHeight,
      defaultPortWidth,
      defaultPortHeight
    );
    if (objectCheck.isDrawable) {
      const nodeElementMatch = objectCheck.gragphChildrenArr.find((e) => {
        return e.id.includes(
          objectCheck.targetId
            .replace("port-", "")
            .slice(0, objectCheck.targetId.replace("port-", "").length - 2)
        );
      });
      const portElementMatch = nodeElementMatch.children.find((e) => {
        return e.id === objectCheck.targetId;
      });
      portElementMatch.cssClasses.push("ready-draw");
    }
    return [];
  }
}

const container = createContainer("sprotty-container");
const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

// cancel draw edge
function cancelDrawEdge() {
  addNode1Btn.removeAttribute("disabled");
  addNode2Btn.removeAttribute("disabled");
  addNode3Btn.removeAttribute("disabled");
  addNode4Btn.removeAttribute("disabled");
  deleteBtn.removeAttribute("disabled");

  drawEdgeBtn.classList.remove("btn-active");
  cancelDrawEdgeBtn.classList.add("hide");

  document.querySelectorAll(".sprotty-node").forEach((e) => {
    (e as HTMLElement).removeAttribute("style");
  });

  document.querySelectorAll(".sprotty-edge").forEach((e) => {
    (e as HTMLElement).classList.remove("selected");
  });

  modelSource.removeElements([
    {
      elementId: dummyNodeArray[0],
      parentId: "graph",
    },
  ]);
  modelSource.removeElements([
    {
      elementId: dummyEdgeId,
      parentId: "graph",
    },
  ]);
  dummyEdgeId = null;
  Array.from(document.getElementsByClassName("ready-draw")).forEach((e) => {
    e.classList.remove("ready-draw");
  });

  dummyNodeArray = [];
  sourceId = "";
  drawMode = false;
  dummyMode = false;
}

const deleteLogic = () => {
  const selectedElements = document.querySelectorAll(".selected");
  selectedElements.forEach((element) => {
    if (element.id.includes("label") || element.id === "") {
      return;
    }

    const idNodeCompare = element.id.replace(
      "sprotty-container_node-type-",
      ""
    );
    edgeArr.forEach((edge) => {
      const edgeSourceIdCompare = edge.sourceId.replace("port-type-", "");
      const edgeTargetIdCompare = edge.targetId.replace("port-type-", "");
      setTimeout(() => {
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
      }, 100);
    });
    modelSource.removeElements([
      {
        parentId: "graph",
        elementId: element.id.replace("sprotty-container_", ""),
      },
    ]);
  });
};

export default function run() {
  modelSource.setModel(graph);

  // elements dom
  addParentNode = document.getElementById("add-parent-node");
  addNode1Btn = document.getElementById("add-node-1");
  addNode2Btn = document.getElementById("add-node-2");
  addNode3Btn = document.getElementById("add-node-3");
  addNode4Btn = document.getElementById("add-node-4");
  drawEdgeBtn = document.getElementById("draw-edge");
  deleteBtn = document.getElementById("delete");
  cancelDrawEdgeBtn = document.getElementById("cancel-draw-edge");
  showJsonBtn = document.getElementById("show-json");
  exportJsonBtn = document.getElementById("export-json");

  // show json
  showJsonBtn.addEventListener("click", () => {
    console.log(JSON.stringify(modelSource.model, null, 2));
    // console.log("showJsonBtn: ", modelSource.model);
  });

  exportJsonBtn.addEventListener("click", () => {
    const name = randomText("graph");
    const jsonFiltered = getGrahpJson(modelSource.model);
    const blob = new Blob([jsonFiltered], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.json`;
    document.body.appendChild(a); // required for firefox
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
  // cancel draw edge
  cancelDrawEdgeBtn.addEventListener("click", () => {
    cancelDrawEdge();
  });

  // draw edge
  function drawLogic() {
    setTimeout(() => {
      document.querySelectorAll(".port").forEach((port) => {
        port.addEventListener("click", (e) => {
          if (!dummyMode) {
            cancelDrawEdgeBtn.classList.remove("hide");
            port.classList.add("ready-draw");
            sourceId = port.id.replace("sprotty-container_port-", "");

            const portTranslateAttribute = port.getAttribute("transform");
            const portCoordinate = portTranslateAttribute
              ? portTranslateAttribute
                  .replace("translate(", "")
                  .replace(")", "")
                  .trim()
                  .split(",")
              : [0, 0];

            const transformAttribute =
              port.parentElement.getAttribute("transform");
            const coordinate = transformAttribute
              ? transformAttribute
                  .replace("translate(", "")
                  .replace(")", "")
                  .trim()
                  .split(",")
              : [0, 0];

            // add dummy node
            if (dummyNodeArray.length == 0) {
              addNode({
                source: modelSource,
                nodeId: "dummy",

                nodeWidth: defaultDummyWidth,
                nodeHeight: defaultDummyHeight,
                portWidth: 2,
                portHeight: 2,
                portQuantity: 1,
                cssClasses: ["nodes", "dummy"],
                name: "",
                // x: Number(coordinate[0]) + 2 * defaultNodeWidth,
                // y: Number(coordinate[1]),
                x: Number(coordinate[0]) + Number(portCoordinate[0]) + 5,
                y: Number(coordinate[1]) + Number(portCoordinate[1]) + 5,
                type: "node",
              });
              dummyNodeArray.push("node-dummy");
              drawEdge({
                source: modelSource,
                edgeId: "dummy",
                sourceNumb: sourceId,
                targetNumb: "dummy-1",
                type: "edge:straight",
                cssClasses: ["dummy-edge"],
              });
              edgeArr.push({
                id: `edge-${edgeNumber}`,
                sourceId: `port-${sourceId}`,
                targetId: "dummy-1",
              });
              dummyEdgeId = "edge-dummy";
            }
            dummyMode = true;
          }
        });
      });
    }, 100);
  }

  // delete

  // add Parent Node
  addParentNode.addEventListener("click", () => {
    addNode({
      source: modelSource,
      nodeId: `type-parent-${nodeParentNumber}`,
      nodeWidth: defaultNodeParentWidth,
      nodeHeight: defaultNodeParentHeight,
      portWidth: defaultPortWidth,
      portHeight: defaultPortHeight,
      portQuantity: 0,
      type: "node:package",
    });
    nodeParentNumber++;
    drawLogic();
  });

  // add node 1
  addNode1Btn.addEventListener("click", () => {
    addNode({
      source: modelSource,
      nodeId: `type-1-${node1Number}`,
      nodeWidth: defaultNodeWidth,
      nodeHeight: defaultNodeHeight,
      portWidth: defaultPortWidth,
      portHeight: defaultPortHeight,
      portQuantity: 1,
      type: "node",
    });

    node1Number++;

    // draw edge
    drawLogic();
  });

  // add node 2
  addNode2Btn.addEventListener("click", () => {
    addNode({
      source: modelSource,
      nodeId: `type-2-${node2Number}`,
      nodeWidth: defaultNodeWidth,
      nodeHeight: defaultNodeHeight,
      portWidth: defaultPortWidth,
      portHeight: defaultPortHeight,
      portQuantity: 2,
      type: "node",
    });

    node2Number++;

    // draw edge
    drawLogic();
  });

  // add node 3
  addNode3Btn.addEventListener("click", () => {
    addNode({
      source: modelSource,
      nodeId: `type-3-${node3Number}`,
      nodeWidth: defaultNodeWidth,
      nodeHeight: defaultNodeHeight,
      portWidth: defaultPortWidth,
      portHeight: defaultPortHeight,
      portQuantity: 3,
      type: "node",
    });

    node3Number++;

    // draw edge
    drawLogic();
  });

  // add node 4
  addNode4Btn.addEventListener("click", () => {
    addNode({
      source: modelSource,
      nodeId: `type-4-${node4Number}`,
      nodeWidth: defaultNodeWidth,
      nodeHeight: defaultNodeHeight,
      portWidth: defaultPortWidth,
      portHeight: defaultPortHeight,
      portQuantity: 4,
      type: "node",
    });

    node4Number++;

    // draw edge
    drawLogic();
  });

  // draw edge
  drawEdgeBtn.addEventListener("click", () => {
    if (!drawMode) {
      addNode1Btn.setAttribute("disabled", "true");
      addNode2Btn.setAttribute("disabled", "true");
      addNode3Btn.setAttribute("disabled", "true");
      addNode4Btn.setAttribute("disabled", "true");
      deleteBtn.setAttribute("disabled", "true");

      drawEdgeBtn.classList.add("btn-active");
      cancelDrawEdgeBtn.classList.remove("hide");

      drawMode = true;
    } else {
      cancelDrawEdge();
    }
  });

  deleteBtn.addEventListener("click", () => {
    deleteLogic();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Delete") {
      deleteLogic();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => run());
