import "reflect-metadata";
import { LocalModelSource, TYPES } from "sprotty";
import { createContainer } from "./di.config";
import { graph } from "./model-source";

import addNode from "./util/addNode";
import drawEdge from "./util/drawEdge";
export default function run() {
  const addNodeBtn = document.getElementById("add-node");
  const drawEdgeBtn = document.getElementById("draw-edge");
  const deleteEdgeBtn = document.getElementById("delete-edge");
  const cancelBtn = document.getElementById("cancel");
  const tipElement = document.querySelector(".tip-container");

  const container = createContainer("sprotty-container");
  const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

  const defaultNodeWidth: number = 100;
  const defaultNodeHeight: number = 100;

  let dummyEdgeArray = [];
  let dummyNodeArray = [];

  let nodeNumber: number = 1;
  let drawMode: boolean = false;
  let dummyMode: boolean = false;

  function cancelDrawMode() {
    dummyMode = false;
    addNodeBtn.removeAttribute("disabled");
    drawEdgeBtn.classList.remove("btn-active");
    deleteEdgeBtn.removeAttribute("disabled");
    cancelBtn.classList.add("hide");
    tipElement.classList.add("hide");
    document.querySelectorAll(".sprotty-node").forEach((e) => {
      (e as HTMLElement).removeAttribute("style");
    });
    modelSource.removeElements([
      {
        elementId: dummyNodeArray[0],
        parentId: "graph",
      },
    ]);
    modelSource.removeElements([
      {
        elementId: dummyEdgeArray[0],
        parentId: "graph",
      },
    ]);
    Array.from(document.getElementsByClassName("ready-draw")).forEach((e) => {
      e.classList.remove("ready-draw");
    });

    dummyEdgeArray = [];
    drawMode = false;
  }

  modelSource.setModel(graph);
  // add node
  addNodeBtn.addEventListener("click", () => {
    addNode(modelSource, nodeNumber, defaultNodeWidth, defaultNodeHeight);
    nodeNumber++;
    setTimeout(() => {
      document
        .querySelectorAll(".node")
        [nodeNumber - 2].addEventListener("click", (event) => {
          if (drawMode && !dummyMode) {
            if (event.target instanceof Element) {
              dummyMode = true;
              (event.target as HTMLElement).parentElement.classList.add(
                "ready-draw"
              );
              const sourceId = event.target.parentElement.id.replace(
                "sprotty-container_node-",
                ""
              );

              const transformAttribute =
                event.target.parentElement.getAttribute("transform");
              const coordinate = transformAttribute
                ? transformAttribute
                    .replace("translate(", "")
                    .replace(")", "")
                    .trim()
                    .split(",")
                : [0, 0];

              if (dummyMode) {
                addNode(
                  modelSource,
                  "dummy",
                  10,
                  10,
                  Number(coordinate[0]) + defaultNodeWidth + 10,
                  Number(coordinate[1]) + defaultNodeHeight / 2 - 5,
                  "",
                  ["nodes", "dummy"]
                );
                dummyNodeArray.push("node-dummy");
                drawEdge(modelSource, sourceId, "dummy", ["dummy-edge"]);
                dummyEdgeArray.push(
                  `edge-between-node${sourceId}-to-nodedummy`
                );
              }

              setTimeout(() => {
                const dummyElement = document.getElementById(
                  "sprotty-container_node-dummy"
                );

                dummyElement.addEventListener("mouseup", () => {
                  const dummyCoordinate = dummyElement
                    .getAttribute("transform")
                    .replace("translate(", "")
                    .replace(")", "")
                    .trim()
                    .split(",")
                    .map((e) => {
                      return Number(e);
                    });

                  const nodeElements = document.querySelectorAll(".node");
                  let nodeElementsArr = [];
                  nodeElements.forEach((node) => {
                    nodeElementsArr.push({
                      id: node.id,
                      coordinate: node.getAttribute("transform")
                        ? node
                            .getAttribute("transform")
                            .replace("translate(", "")
                            .replace(")", "")
                            .trim()
                            .split(",")
                            .map((e) => {
                              return Number(e);
                            })
                        : [0, 0],
                    });
                  });

                  const filteredNode = nodeElementsArr.filter((node) => {
                    return (
                      node.coordinate[0] <= dummyCoordinate[0] &&
                      dummyCoordinate[0] <=
                        node.coordinate[0] + defaultNodeWidth &&
                      node.coordinate[1] <= dummyCoordinate[1] &&
                      dummyCoordinate[1] <=
                        node.coordinate[1] + defaultNodeHeight
                    );
                  });
                  filteredNode.forEach((node) => {
                    (
                      document.getElementById(node.id) as HTMLElement
                    ).classList.add("ready-draw");
                    drawEdge(
                      modelSource,
                      sourceId,
                      node.id.replace("sprotty-container_node-", "")
                    );

                    cancelDrawMode();
                  });
                });
              }, 100);
            } else {
              return;
            }
            // if (drawModeCounter > 1) {
            //   drawModeCounter = 0;
            //   drawEdge(
            //     modelSource,
            //     drawModeSelectedArray[0],
            //     drawModeSelectedArray[1]
            //   );
            //   document.querySelectorAll(".sprotty-node").forEach((e) => {
            //     (e as HTMLElement).removeAttribute("style");
            //   });
            // }
          }
        });
    }, 100);
  });
  // draw mode
  drawEdgeBtn.addEventListener("click", () => {
    if (drawMode === false) {
      addNodeBtn.setAttribute("disabled", "");
      drawEdgeBtn.classList.add("btn-active");
      deleteEdgeBtn.setAttribute("disabled", "");
      cancelBtn.classList.remove("hide");
      drawMode = true;
      tipElement.classList.remove("hide");
    } else {
      cancelDrawMode();
    }
  });
  // delete mode
  deleteEdgeBtn.addEventListener("click", () => {
    const edgeElements = document.querySelectorAll(".sprotty-edge");
    const selectedEdgeElements = Array.from(edgeElements).filter((e) => {
      return e.classList.contains("selected");
    });
    selectedEdgeElements.forEach((element) => {
      modelSource.removeElements([
        {
          parentId: "graph",
          elementId: element.id.replace("sprotty-container_", ""),
        },
      ]);
    });
  });
  // cancel btn
  cancelBtn.addEventListener("click", () => {
    if (drawMode === true) {
      cancelDrawMode();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => run());
