import "reflect-metadata";
import {
  LocalModelSource,
  MouseListener,
  SPortImpl,
  TYPES,
  IButtonHandler,
  SButtonImpl,
  SModelElementImpl,
  ElementMove,
  IActionDispatcher,
  SLabelImpl,
} from "sprotty";
import {
  Action,
  SGraph,
  Bounds,
  Point,
  getBasicType,
  MoveAction,
} from "sprotty-protocol";
import { createContainer } from "./di.config";
import { CenterAction } from "sprotty-protocol";
import { Environment, editor } from "monaco-editor";

// settings
import * as config from "./settings/config.json";

// utils
import addNode from "./util/addNode";
import drawEdge from "./util/drawEdge";
import addCustomSVG from "./util/addCustomSVG";
import checkIdElement from "./util/checkIdElement";
import randomText from "./util/randomText";
import getGrahpJson from "./util/getGraphJson";
import checkPositionEl from "./util/checkPositionEl";
import { injectable } from "inversify";
import addCustomNode from "./util/addCustomNode";
import { findMax } from "./util/Math/findMax";
import { generateInputElements } from "./util/generateInputEl";

declare global {
  interface Window {
    MonacoEnvironment?: Environment;
  }
}
// elements dom
let addParentNode = null;

let drawEdgeBtn = null;
let cancelDrawEdgeBtn = null;
let deleteBtn = null;
let addCustomSVGEl = null;
let svgTextEl = null;
let closeModalBtnEl = null;
let addCustomBtn = null;

let codeEditorEl = null;
let closeEditorBtnEl = null;
let exportJsonBtn = null;
let importJsonBtn = null;
let showJsonBtn = null;
let submitJsonBtn = null;
let inputFile = null;
let selecteNodeEl = null;
let node1ShapeEl = null;
let node2ShapeEl = null;
let node3ShapeEl = null;
let node4ShapeEl = null;
let nodeShapeEls = null;

let zoomInBtn = null;
let zoomOutBtn = null;
let defaultScaleBtn = null;

function focusGraph(): void {
  const graphElement = document.getElementById("graph");
  if (graphElement !== null && typeof graphElement.focus === "function")
    graphElement.focus();
}

function getVisibleBounds({
  canvasBounds,
  scroll,
  zoom,
}: {
  canvasBounds: Bounds;
  scroll: Point;
  zoom: number;
}): Bounds {
  return {
    ...scroll,
    width: canvasBounds.width / zoom,
    height: canvasBounds.height / zoom,
  };
}

let graphDisplay;
const graph: SGraph = {
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

const shapeEl = document.getElementsByClassName("shape");

const nodeArr = [...shapeEl].map((e) => {
  const portNumber = +e.id.replace("node-", "").replace("-shape", "");
  const nodeCompare = graphDisplay.children.filter((e) => {
    return e.portQuantity === portNumber;
  });

  return {
    portNumber,
    children: [...e.children].map((i) => {
      return {
        id: i.id,
        count:
          nodeCompare.filter((e) => {
            return e.id.includes(i.id);
          }).length + 1,
      };
    }),
  };
});

let nodeParentNumber =
  checkIdElement(graphDisplay).countIdNodeParent !== null
    ? checkIdElement(graphDisplay).countIdNodeParent
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
let isLabel = false;

// source
let sourceId = null;
let targetId = null;
let portType = null;
let customSVGCount = 1;

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

let countScroll = 0;
export class CustomMouseListener extends MouseListener {
  mouseUp(target: any, event: MouseEvent): (Action | Promise<Action>)[] {
    console.log(target instanceof SPortImpl);
    if (target instanceof SLabelImpl) {
      isLabel = true;
      // document.querySelectorAll(".sprotty-label").forEach((text) => {
      //   (text as HTMLElement).classList.add("visible");
      // });
    } else {
      isLabel = false;
    }

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
    updateEditor();

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
    updateEditor();

    return [];
  }
  wheel(
    target: SModelElementImpl,
    event: WheelEvent
  ): (Action | Promise<Action>)[] {
    if (event.deltaY > 0) {
      countScroll--;
    } else if (event.deltaY < 0) {
      countScroll++;
    }
    return [];
  }
}
@injectable()
export class CustomButtonHandler implements IButtonHandler {
  buttonPressed(button: SButtonImpl): Action[] {
    alert("button on" + button.parent.id + " pressed");
    return [];
  }
}

const container = createContainer("sprotty-container");
const dispatcher = container.get<IActionDispatcher>(TYPES.IActionDispatcher);
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

let monacoEditor: any;
const jsonFiltered = getGrahpJson(modelSource.model);
monacoEditor = editor.create(document.getElementById("editor-json"), {
  value: jsonFiltered,
  language: "javascript",

  lineNumbers: "on",
  roundedSelection: false,
  scrollBeyondLastLine: false,
  readOnly: false,
  // theme: "vs-dark",
  glyphMargin: true,
  automaticLayout: true,
  foldingMaximumRegions: 100,
  // lineDecorationsWidth: 100,
});
// showJsonBtn.addEventListener("click", () => {
// });
const updateEditor = () => {
  const jsonFiltered = getGrahpJson(modelSource.model);
  monacoEditor.setValue(jsonFiltered);
};

export default async function run() {
  window.MonacoEnvironment = {
    getWorkerUrl: function (workerId: string, label: string) {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: '${location.origin}/node_modules/monaco-editor/min/'
        };
        importScripts('${location.origin}/node_modules/monaco-editor/min/vs/base/worker/workerMain.js');
      `)}`;
    },
  };
  modelSource.setModel(graphDisplay);
  localStorage.clear();

  drawLogic();
  // elements dom
  addParentNode = document.getElementById("add-parent-node");
  // addNodeEl = document.getElementById("add-node-btn");
  drawEdgeBtn = document.getElementById("draw-edge");
  deleteBtn = document.getElementById("delete");
  cancelDrawEdgeBtn = document.getElementById("cancel-draw-edge");
  // showJsonBtn = document.getElementById("show-json");
  exportJsonBtn = document.getElementById("export-json");
  importJsonBtn = document.getElementById("import-json");
  showJsonBtn = document.getElementById("show-json");
  inputFile = document.getElementById("input-file");
  selecteNodeEl = document.getElementById("select-node");
  node1ShapeEl = document.getElementById("node-1-shape");
  node2ShapeEl = document.getElementById("node-2-shape");
  node3ShapeEl = document.getElementById("node-3-shape");
  node4ShapeEl = document.getElementById("node-4-shape");
  nodeShapeEls = document.querySelectorAll(".node-shape");
  zoomInBtn = document.getElementById("zoom-in");
  zoomOutBtn = document.getElementById("zoom-out");
  defaultScaleBtn = document.getElementById("default");
  addCustomSVGEl = document.getElementById("add-custom-svg");
  svgTextEl = document.getElementById("area_field_svg");
  closeModalBtnEl = document.getElementById("close-modal-btn");
  codeEditorEl = document.getElementById("code-editor");
  closeEditorBtnEl = document.getElementById("close-editor-btn");
  submitJsonBtn = document.getElementById("submit-json-btn");

  // scale

  const setEventScroll = (deltaY) => {
    const graphEl = document.getElementById("sprotty-container_graph");
    const evt = new WheelEvent("wheel", {
      deltaY,
      deltaMode: WheelEvent.DOM_DELTA_PIXEL,
      clientX: graphEl.clientWidth / 2,
      clientY: graphEl.clientHeight / 2,
    });
    graphEl.dispatchEvent(evt);
  };
  zoomInBtn.addEventListener("click", () => {
    setEventScroll(-80);
  });
  zoomOutBtn.addEventListener("click", () => {
    setEventScroll(80);
  });
  defaultScaleBtn.addEventListener("click", () => {
    // setEventScroll(80 * countScroll);
    // countScroll = 0;
    return [CenterAction.create([])];
  });

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

  closeEditorBtnEl.addEventListener("click", () => {
    monacoEditor.setValue("");
  });
  submitJsonBtn.addEventListener("click", () => {
    const parseGraph = JSON.parse(monacoEditor.getValue() as string);
    localStorage.setItem("graph", JSON.stringify(parseGraph));
    closeEditorBtnEl.click();
    window.location.reload();
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

  // add node logic

  const addNodeLogic = () => {
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

    drawLogic();
    updateEditor();
  };

  // draw edge
  function drawLogic() {
    setTimeout(() => {
      document.querySelectorAll(".port").forEach((port) => {
        port.addEventListener("click", (e) => {
          if (!isLabel) {
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
              if (!isLabel) {
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
                  x: isParent
                    ? Number(coordinateParent[0]) + defaultX
                    : defaultX,
                  y: isParent
                    ? Number(coordinateParent[1]) + defaultY
                    : defaultY,
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
                updateEditor();
              }
            }
            dummyMode = true;
          }
        });
      });
      updateEditor();
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
    updateEditor();
  });

  nodeShapeEls.forEach((e: any) => {
    e.ondragstart = (event) => {
      const targetEl = event.target;

      if (nodeAddId === targetEl.id) {
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
    };
    e.addEventListener("click", (event: any) => {
      const targetEl = event.target;

      if (nodeAddId === targetEl.id) {
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
    updateEditor();
  });

  // Add Node by drag
  const sprottyEl = document.getElementById("sprotty");

  sprottyEl.ondragover = (event) => {
    event.preventDefault();
  };
  sprottyEl.ondrop = (event) => {
    addNodeLogic();
  };

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
    updateEditor();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Delete") {
      deleteLogic();
      updateEditor();
    }
  });

  const initialViewport = await modelSource.getViewport();

  let viewport = initialViewport;
  window.addEventListener("resize", async () => {
    viewport = await modelSource.getViewport();
  });

  const alignNode = (how: string) => {
    const bounds = getVisibleBounds(viewport);

    const nodeMoves: ElementMove[] = [];
    let postionArr = [];
    let fixNode;
    graphDisplay.children.forEach((shape) => {
      const shapeElId = `sprotty-container_${shape.id}`;
      const shapeEl = document.getElementById(shapeElId);

      if (
        getBasicType(shape) === "node" &&
        shapeEl.classList.contains("selected")
      ) {
        const shapeElPosition = shapeEl
          .getAttribute("transform")
          .replace("translate(", "")
          .replace(")", "")
          .trim()
          .split(",");

        const position = {
          id: shape.id,
          x: +shapeElPosition[0],
          y: +shapeElPosition[1],
        };
        postionArr.push(position);
      }
    });

    if (how === "left") {
      const minValueX = Math.min(...postionArr.map((position) => position.x));
      fixNode = postionArr.find((postion) => {
        return postion.x === minValueX;
      });
      postionArr.forEach((position) => {
        if (position.x !== fixNode.x) {
          nodeMoves.push({
            elementId: position.id,
            toPosition: {
              x: fixNode.x,
              y: position.y,
            },
          });
        }
      });
    } else if (how === "right") {
      console.log("click");
      const maxValueX = Math.max(...postionArr.map((position) => position.x));
      fixNode = postionArr.find((postion) => {
        return postion.x === maxValueX;
      });
      postionArr.forEach((position) => {
        if (position.x !== fixNode.x) {
          nodeMoves.push({
            elementId: position.id,
            toPosition: {
              x: fixNode.x,
              y: position.y,
            },
          });
        }
      });
    } else if (how === "top") {
      const minValueY = Math.min(...postionArr.map((position) => position.y));
      fixNode = postionArr.find((postion) => {
        return postion.y === minValueY;
      });
      postionArr.forEach((position) => {
        if (position.y !== fixNode.y) {
          nodeMoves.push({
            elementId: position.id,
            toPosition: {
              x: position.x,
              y: fixNode.y,
            },
          });
        }
      });
    } else if (how === "bottom") {
      const maxValueY = Math.max(...postionArr.map((position) => position.y));
      fixNode = postionArr.find((postion) => {
        return postion.y === maxValueY;
      });
      postionArr.forEach((position) => {
        if (position.y !== fixNode.y) {
          nodeMoves.push({
            elementId: position.id,
            toPosition: {
              x: position.x,
              y: fixNode.y,
            },
          });
        }
      });
    }

    dispatcher.dispatch(
      MoveAction.create(nodeMoves, {
        animate: true,
        // stoppable: true,
        // finished: true,
      })
    );
    focusGraph();
  };

  document.getElementById("align-left").addEventListener("click", async () => {
    alignNode("left");
    updateEditor();
  });
  console.log(document.getElementById("align-right"));
  document.getElementById("align-right").addEventListener("click", async () => {
    alignNode("right");
    updateEditor();
  });
  document.getElementById("align-top").addEventListener("click", () => {
    alignNode("top");
    updateEditor();
  });
  document.getElementById("align-bottom").addEventListener("click", () => {
    alignNode("bottom");
    updateEditor();
  });

  // add custom SVG

  addCustomSVGEl.addEventListener("click", () => {
    const id = `custom-node-${customSVGCount}`;

    let svgText = svgTextEl.value;

    let parser = new DOMParser();

    // Use the DOMParser to parse the SVG string into a document
    let doc = parser.parseFromString(svgText, "image/svg+xml");

    // Get all the 'rect' elements from the document
    let rects = doc.getElementsByTagName("rect");
    let ellipse = doc.getElementsByTagName("ellipse");

    // Convert the HTMLCollection to an array
    let svgArray = [...Array.from(rects), ...Array.from(ellipse)];

    const svgAttArray = svgArray.map((svg) => {
      return {
        x: +svg.getAttribute("x"),
        cx: +svg.getAttribute("cx"),
        y: +svg.getAttribute("y"),
        cy: +svg.getAttribute("cy"),
        width: +svg.getAttribute("width"),
        rx: svg.getAttribute("rx"),
        height: +svg.getAttribute("height"),
        ry: svg.getAttribute("ry"),
        code: svg.outerHTML,
      };
    });

    const { portGeneratedArr, nodeId } = addCustomNode({
      source: modelSource,
      nodeId: id,
      svgAttArr: svgAttArray,
    });
    customSVGCount++;

    generateInputElements(portGeneratedArr, "port-text", modelSource, nodeId);
    drawLogic();
    updateEditor();
  });
}

document.addEventListener("DOMContentLoaded", () => run());
