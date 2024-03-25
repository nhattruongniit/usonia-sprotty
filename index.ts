import "reflect-metadata";
import {
  LocalModelSource,
  MouseListener,
  SEdgeImpl,
  SModelElementImpl,
  SNodeImpl,
  SPortImpl,
  SRoutingHandleImpl,
  SelectMouseListener,
  TYPES,
} from "sprotty";
import { Action, Selectable } from "sprotty-protocol";
import { createContainer } from "./di.config";

// settings
import * as config from "./settings/config.json";

// utils
import addNode from "./util/addNode";
import drawEdge from "./util/drawEdge";
import checkIdElement from "./util/checkIdElement";
import randomText from "./util/randomText";
import getGrahpJson from "./util/getGraphJson";
import checkPositionEl from "./util/checkPositionEl";

// elements dom
let addParentNode = null;
let addNodeEl = null;
// let addNode1Btn = null;
// let addNode2Btn = null;
// let addNode3Btn = null;
// let addNode4Btn = null;
let drawEdgeBtn = null;
let cancelDrawEdgeBtn = null;
let deleteBtn = null;
let dummyNodeBtn = null;
let showJsonBtn = null;
let exportJsonBtn = null;
let importJsonBtn = null;
let inputFile = null;
let selecteNodeEl = null;
let node1ShapeEl = null;
let node2ShapeEl = null;
let node3ShapeEl = null;
let node4ShapeEl = null;
let nodeShapeEls = null;

// count of
let graphDisplay;
const graph: any = {
  type: "graph",
  id: "graph",
  children: [],
};

graphDisplay = JSON.parse(localStorage.getItem("graph"))
  ? JSON.parse(localStorage.getItem("graph"))
  : graph;
if (graphDisplay !== graph && !graphDisplay.isValidGraph) {
  graphDisplay = graph;
  alert("Invaid type of files, please re-import !!!");
}

let portNumber = null;
let nodeAddId = null;
let addMode = false;

const shapeEl = document.getElementsByClassName("shape");

const nodeArr = [...shapeEl].map((e) => {
  return {
    portNumber: +e.id.replace("node-", "").replace("-shape", ""),
    children: [...e.children].map((i) => {
      return {
        id: i.id,
        count: 1,
      };
    }),
  };
});
console.log(nodeArr);
// console.log(checkIdElement(graphDisplay));
console.log(graphDisplay);

let nodeParentNumber =
  checkIdElement(graphDisplay).countIdNodeParent !== null
    ? checkIdElement(graphDisplay).countIdNodeParent
    : 1;
let node1Number =
  checkIdElement(graphDisplay).countIdNodeType1 !== null
    ? checkIdElement(graphDisplay).countIdNodeType1
    : 1;
let node2Number =
  checkIdElement(graphDisplay).countIdNodeType2 !== null
    ? checkIdElement(graphDisplay).countIdNodeType2
    : 1;
let node3Number =
  checkIdElement(graphDisplay).countIdNodeType3 !== null
    ? checkIdElement(graphDisplay).countIdNodeType3
    : 1;
let node4Number =
  checkIdElement(graphDisplay).countIdNodeType4 !== null
    ? checkIdElement(graphDisplay).countIdNodeType4
    : 1;

// count of edges
let edgeNumber =
  checkIdElement(graphDisplay).countIdEdge !== null
    ? checkIdElement(graphDisplay).countIdEdge
    : 1;

// dummy
let edgeArr = [];
let dummyNodeArray = [];
let dummyEdgeId = null;

// size nodes & ports & label
// let NODE_WIDTH;
// let NODE_HEIGHT;

// (config, config.EDGE_ARROW_FILL);
const NODE_WIDTH = config.NODE_WIDTH;
const NODE_HEIGHT = config.NODE_HEIGTH;
const PORT_WIDTH = config.PORT_WIDTH;
const PORT_HEIGHT = config.PORT_HEIGTH;

const NODE_PARENT_WIDTH = NODE_WIDTH * 4;
const NODE_PARENT_HEIGHT = NODE_HEIGHT * 4;
const PORT_PARENT_WIDTH = config.PORT_WIDTH;
const PORT_PARENT_HEIGHT = config.PORT_HEIGTH;

const NODE_DUMMY_WIDTH = config.NODE_DUMMY_WIDTH;
const NODE_DUMMY_HEIGHT = config.NODE_DUMMY_HEIGTH;

// state of draw edge
let drawMode = false;
let dummyMode = false;

// source
let sourceId = null;
let targetId = null;
let portType = null;

// JSON resolve

let portTarget: HTMLElement;

// styles
const styles = `
.dummy .sprotty-node {
  fill: ${config.NODE_DUMMY_FILL};
  stroke: ${config.EDGE_DUMMY_STROKE};
}
.dummy-edge {
  fill: ${config.EDGE_DUMMY_FILL};
  stroke: ${config.EDGE_DUMMY_STROKE};
}
.ready-draw .sprotty-port,
.ready-draw-source .sprotty-port {
  fill: ${config.READY_DRAW_PORT_FILL};
}
.sprotty-node {
  stroke: ${config.NODE_STROKE};
  fill: ${config.NODE_FILL};
}
.sprotty-node.mouseover {
  fill: ${config.NODE_FILL_HOVER};
  stroke: ${config.NODE_FILL_HOVER};
}
.sprotty-port.mouseover {
  stroke: ${config.NODE_FILL_HOVER};
}
.sprotty-port {
  stroke: ${config.PORT_STROKE};
  stroke-width: 1;
  fill: ${config.PORT_FILL};
}
.sprotty-edge {
  fill: ${config.EDGE_FILL};
  stroke: ${config.EDGE_STROKE};
}
.node-package {
  fill: ${config.NODE_PARENT_FILL};
  stroke: ${config.NODE_PARENT_STROKE};
}
.sprotty-edge .arrowhead {
  fill: ${config.EDGE_ARROW_FILL}
}
.node-package.mouseover {
  fill: ${config.NODE_PARENT_FILL_HOVER};
  stroke: ${config.NODE_PARENT_STROKE_HOVER};
}
 }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export class CustomMouseListener extends MouseListener {
  mouseUp(target: any, event: MouseEvent): (Action | Promise<Action>)[] {
    // code connect by dummy node

    const objectCheck = checkPositionEl(
      target,
      NODE_DUMMY_WIDTH,
      NODE_DUMMY_HEIGHT,
      NODE_WIDTH,
      NODE_HEIGHT,
      PORT_WIDTH,
      PORT_HEIGHT
    );
    if (objectCheck.isDrawable) {
      targetId = objectCheck.targetId;

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
    if (target instanceof SPortImpl) {
    }
    const objectCheck = checkPositionEl(
      target,
      NODE_DUMMY_WIDTH,
      NODE_DUMMY_HEIGHT,
      NODE_WIDTH,
      NODE_HEIGHT,
      PORT_WIDTH,
      PORT_HEIGHT
    );
    let portElementMatch: SPortImpl;

    let nodeElementMatch;

    if (objectCheck.gragphChildrenArr.length > 0) {
      nodeElementMatch = objectCheck.gragphChildrenArr.find((e) => {
        return e.id.includes(
          objectCheck.targetId
            .replace("port-", "")
            .slice(0, objectCheck.targetId.replace("port-", "").length - 2)
        );
      });
    }

    if (objectCheck.isDrawable) {
      portTarget = document.getElementById(
        `sprotty-container_${objectCheck.targetId}`
      );
      portTarget.classList.add("ready-draw");
    } else if (!objectCheck.isDrawable) {
      if (portTarget) {
        portTarget.classList.remove("ready-draw");
      }
    }

    return [];
  }
}

const container = createContainer("sprotty-container");
const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

// cancel draw edge
function cancelDrawEdge() {
  deleteBtn.removeAttribute("disabled");

  drawEdgeBtn.classList.remove("btn-active");
  cancelDrawEdgeBtn.classList.add("hide");

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
  Array.from(document.getElementsByClassName("ready-draw-source")).forEach(
    (e) => {
      e.classList.remove("ready-draw-source");
    }
  );

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

    const idNodeCompare = element.id.replace("sprotty-container_node-", "");

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
  modelSource.setModel(graphDisplay);
  localStorage.clear();
  drawLogic();
  // elements dom
  addParentNode = document.getElementById("add-parent-node");
  addNodeEl = document.getElementById("add-node-btn");
  drawEdgeBtn = document.getElementById("draw-edge");
  deleteBtn = document.getElementById("delete");
  cancelDrawEdgeBtn = document.getElementById("cancel-draw-edge");
  showJsonBtn = document.getElementById("show-json");
  exportJsonBtn = document.getElementById("export-json");
  importJsonBtn = document.getElementById("import-json");
  inputFile = document.getElementById("input-file");
  selecteNodeEl = document.getElementById("select-node");
  node1ShapeEl = document.getElementById("node-1-shape");
  node2ShapeEl = document.getElementById("node-2-shape");
  node3ShapeEl = document.getElementById("node-3-shape");
  node4ShapeEl = document.getElementById("node-4-shape");
  nodeShapeEls = document.querySelectorAll(".node-shape");

  // UI
  selecteNodeEl.addEventListener("change", (event: any) => {
    const nodeValue = +event.target.value;
    if (nodeValue === 1) {
      node1ShapeEl.classList.remove("hide");
      !node2ShapeEl.classList.contains("hide") &&
        node2ShapeEl.classList.add("hide");
      !node3ShapeEl.classList.contains("hide") &&
        node3ShapeEl.classList.add("hide");
      !node4ShapeEl.classList.contains("hide") &&
        node4ShapeEl.classList.add("hide");
    } else if (nodeValue === 2) {
      node2ShapeEl.classList.remove("hide");
      !node1ShapeEl.classList.contains("hide") &&
        node1ShapeEl.classList.add("hide");
      !node3ShapeEl.classList.contains("hide") &&
        node3ShapeEl.classList.add("hide");
      !node4ShapeEl.classList.contains("hide") &&
        node4ShapeEl.classList.add("hide");
    } else if (nodeValue === 3) {
      node3ShapeEl.classList.remove("hide");
      !node1ShapeEl.classList.contains("hide") &&
        node1ShapeEl.classList.add("hide");
      !node2ShapeEl.classList.contains("hide") &&
        node2ShapeEl.classList.add("hide");
      !node4ShapeEl.classList.contains("hide") &&
        node4ShapeEl.classList.add("hide");
    } else if (nodeValue === 4) {
      node4ShapeEl.classList.remove("hide");
      !node1ShapeEl.classList.contains("hide") &&
        node1ShapeEl.classList.add("hide");
      !node2ShapeEl.classList.contains("hide") &&
        node2ShapeEl.classList.add("hide");
      !node3ShapeEl.classList.contains("hide") &&
        node3ShapeEl.classList.add("hide");
    } else {
      !node1ShapeEl.classList.contains("hide") &&
        node1ShapeEl.classList.add("hide");
      !node2ShapeEl.classList.contains("hide") &&
        node2ShapeEl.classList.add("hide");
      !node3ShapeEl.classList.contains("hide") &&
        node3ShapeEl.classList.add("hide");
      !node4ShapeEl.classList.contains("hide") &&
        node4ShapeEl.classList.add("hide");
    }
  });

  // show json
  showJsonBtn.addEventListener("click", () => {
    JSON.stringify(modelSource.model, null, 2);
    // ("showJsonBtn: ", modelSource.model);
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

  importJsonBtn.addEventListener("click", () => {
    // logic import file
    inputFile.click();
  });

  inputFile.addEventListener("change", (event) => {
    // (event.target.files[0]);
    if (!event.target.files[0]) {
      return;
    }
    const reader = new FileReader();
    // reader.readAsText(event.target.files[0]);
    reader.readAsText(event.target.files[0]);
    reader.onload = (event) => {
      const dataImport = event.target.result;
      const parseGraph = JSON.parse(dataImport as string);
      localStorage.setItem("graph", JSON.stringify(parseGraph));

      location.reload();
    };
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
            port.classList.add("ready-draw-source");
            sourceId = port.id.replace("sprotty-container_port-", "");
            const portTranslateAttribute = port.getAttribute("transform");
            const portCoordinate = portTranslateAttribute
              ? portTranslateAttribute
                  .replace("translate(", "")
                  .replace(")", "")
                  .trim()
                  .split(",")
              : [0, 0];
            let isParent = false;

            if (port.parentElement.id.includes("node-child-type-parent")) {
              isParent = true;
            }
            const transformAttribute =
              port.parentElement.getAttribute("transform");
            const coordinate = transformAttribute
              ? transformAttribute
                  .replace("translate(", "")
                  .replace(")", "")
                  .trim()
                  .split(",")
              : [0, 0];
            const transformAttributeParent =
              port.parentElement.parentElement.getAttribute("transform");
            const coordinateParent = transformAttributeParent
              ? transformAttributeParent
                  .replace("translate(", "")
                  .replace(")", "")
                  .trim()
                  .split(",")
              : [0, 0];

            const defaultX =
              Number(coordinate[0]) + Number(portCoordinate[0]) + 5;
            const defaultY =
              Number(coordinate[1]) + Number(portCoordinate[1]) + 5;
            // add dummy node
            if (dummyNodeArray.length == 0) {
              addNode({
                isParentNode: false,
                source: modelSource,
                nodeId: "dummy",
                nodeWidth: NODE_DUMMY_WIDTH,
                nodeHeight: NODE_DUMMY_HEIGHT,
                portWidth: 2,
                portHeight: 2,
                portQuantity: 1,

                cssClasses: ["nodes", "dummy"],
                name: "",
                // x: Number(coordinate[0]) + 2 * NODE_WIDTH,
                // y: Number(coordinate[1]),
                x: isParent ? Number(coordinateParent[0]) + defaultX : defaultX,
                y: isParent ? Number(coordinateParent[1]) + defaultY : defaultY,
                type: "node",
                portType: "1",
              });
              dummyNodeArray.push("dummy");
              drawEdge({
                source: modelSource,
                edgeId: "dummy",
                sourceNumb: sourceId,
                targetNumb: "dummy-1",
                type: "edge:straight",
                cssClasses: ["dummy-edge"],
              });

              dummyEdgeId = "edge-dummy";
            }
            dummyMode = true;
          }
        });
      });
    }, 100);
  }

  // add Parent Node
  addParentNode.addEventListener("click", () => {
    addNode({
      isParentNode: true,
      source: modelSource,
      nodeId: `type-parent-${nodeParentNumber}`,
      nodeWidth: NODE_PARENT_WIDTH,
      nodeHeight: NODE_PARENT_HEIGHT,
      portWidth: PORT_PARENT_WIDTH,
      portHeight: PORT_PARENT_HEIGHT,
      portQuantity: 1,
      type: "node:package",
      portType: "1",
    });
    nodeParentNumber++;
    drawLogic();
  });

  nodeShapeEls.forEach((e: any) => {
    e.addEventListener("click", (event: any) => {
      const targetEl = event.target;
      addMode = true;
      if (nodeAddId === targetEl.id) {
        addMode = false;
        nodeAddId = null;
      }
      portNumber = +targetEl.parentNode.id
        .replace("node-", "")
        .replace("-shape", "");
      nodeAddId = targetEl.id;
      targetEl.classList.toggle("selected-node-add");
      nodeShapeEls.forEach((e: any) => {
        if (e.id !== targetEl.id) {
          e.classList.remove("selected-node-add");
        }
      });
    });
  });

  addNodeEl.addEventListener("click", () => {
    if (addMode) {
      const portType = nodeAddId.replace(`node-${portNumber}-port-`, "");
      const nodeTypeAddIndex = nodeArr.findIndex((e) => {
        return e.portNumber === portNumber;
      });
      const nodeTypeAdd = nodeArr[nodeTypeAddIndex];
      const nodeAddIndex = nodeTypeAdd.children.findIndex((e) => {
        return e.id === nodeAddId;
      });
      const nodeAdd = nodeTypeAdd.children[nodeAddIndex];
      addNode({
        isParentNode: false,
        source: modelSource,
        nodeId: `${nodeAdd.id}-${nodeAdd.count}`,
        nodeWidth: NODE_WIDTH,
        nodeHeight: NODE_HEIGHT,
        portWidth: PORT_WIDTH,
        portHeight: PORT_HEIGHT,
        portQuantity: portNumber,
        portType,
        type: "node",
      });
      nodeAdd.count++;
    }
    drawLogic();
  });

  // draw edge
  drawEdgeBtn.addEventListener("click", () => {
    if (!drawMode) {
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
