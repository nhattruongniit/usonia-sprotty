
import "reflect-metadata";
import { LocalModelSource, TYPES } from "sprotty";
import { createContainer } from "./di.config";
import { graph } from "./model-source";

import addNode from "./util/addNode";
import drawEdge from "./util/drawEdge";






// export class CustomMouseListener extends MouseListener {
//   mouseUp(target: SModelElementImpl, event: MouseEvent): (Action | Promise<Action>)[] {
//     if (target instanceof SRoutingHandleImpl) {
//       if (!(target.parent as SEdgeImpl).targetId.includes("dummy")) {
      
//         setTimeout(() => {
//           cancelDrawMode()
//         }, 100)
//       }
//     }
//     return [];
//   }

// }

let addNode1Btn
let addNode2Btn
let addNode3Btn
let addNode4Btn
let drawEdgeBtn
let deleteEdgeBtn
let cancelBtn

const container = createContainer("sprotty-container");
const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

const defaultNodeWidth: number = 100;
const defaultNodeHeight: number = 100;
const defaultPortWidth: number = 20;
const defaultPortHeight: number = 20;
const defaultDummyWidth: number = 1;
const defaultDummyHeight: number = 1;

let dummyEdgeArray = [];
let dummyNodeArray = [];

let sourceId: any;

let edgeNumber: any = 1;

let node1Number: any = 1;
let node2Number: any = 1;
let node3Number: any = 1;
let node4Number: any = 1;

let label1Id: any = 1;
let label2Id: any = 1;
let label3Id: any = 1;
let label4Id: any = 1;


let drawMode: boolean = false
let dummyMode: boolean = false;



function cancelDrawMode() {


  addNode1Btn.removeAttribute("disabled");
  addNode2Btn.removeAttribute("disabled");
  addNode3Btn.removeAttribute("disabled");
  addNode4Btn.removeAttribute("disabled");
  drawEdgeBtn.classList.remove("btn-active");
  deleteEdgeBtn.removeAttribute("disabled");
  cancelBtn.classList.add("hide");

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
  // modelSource.removeElements([
  //   {
  //     elementId: dummyEdgeArray[0],
  //     parentId: "graph",
  //   },
  // ]);
  
  Array.from(document.getElementsByClassName("ready-draw")).forEach((e) => {
    e.classList.remove("ready-draw");
  });
  dummyNodeArray = [];

  sourceId = "";
  drawMode = false;
  dummyMode = false;
}




export default function run() {
  modelSource.setModel(graph);

  addNode1Btn = document.getElementById("add-node-1");
  addNode2Btn = document.getElementById("add-node-2");
  addNode3Btn = document.getElementById("add-node-3");
  addNode4Btn = document.getElementById("add-node-4");
  drawEdgeBtn = document.getElementById("draw-edge");
  deleteEdgeBtn = document.getElementById("delete-edge");
  cancelBtn = document.getElementById("cancel");

  cancelBtn.addEventListener("click", () => {
    if (drawMode === true) {
      // drawMode = false;
      console.log('click')
      cancelDrawMode();
    }
  });

  const drawLogic = () => {
    setTimeout(() => {
      document.querySelectorAll(".port").forEach((port) => {
        port.addEventListener("click", () => {
          if (drawMode && !dummyMode) {
            // TAO DUMMY

            dummyMode = true;
            port.classList.add("ready-draw");
            sourceId = port.id.replace("sprotty-container_port-", "");
            const transformAttribute =
              port.parentElement.getAttribute("transform");
            const coordinate = transformAttribute
              ? transformAttribute
                .replace("translate(", "")
                .replace(")", "")
                .trim()
                .split(",")
              : [0, 0];
            if (dummyNodeArray.length === 0) {
              addNode(
                modelSource,
                "dummy",
                defaultDummyWidth,
                defaultDummyHeight,
                "dummy",
                1,
                2,
                2,
                ["nodes", "dummy"],
                "",
                Number(coordinate[0]) + 2 * defaultNodeWidth,
                Number(coordinate[1])
              );

              dummyNodeArray.push("node-dummy");
              drawEdge(modelSource, edgeNumber, sourceId, "dummy-1", [
                "dummy-edge",
              ]);
              edgeNumber++;
              dummyMode = false;
              console.log(modelSource)
            }



            // dummyEdgeArray.push(`edge-between-node${sourceId}-to-nodedummy-1`);

          }

          // Ve EDGE
          // if (drawMode) {
          //   setTimeout(() => {
          //     const dummyElement = document.getElementById(
          //       "sprotty-container_node-dummy"
          //     );

          //     dummyElement.addEventListener("mouseup", () => {
          //       const dummyCoordinate = dummyElement
          //         .getAttribute("transform")
          //         .replace("translate(", "")
          //         .replace(")", "")
          //         .trim()
          //         .split(",")
          //         .map((e) => {
          //           return Number(e);
          //         });

          //       const nodeElements = document.querySelectorAll(".node");
          //       let nodeElementsArr = [];
          //       nodeElements.forEach((node) => {
          //         nodeElementsArr.push({
          //           id: node.id,
          //           coordinate: node.getAttribute("transform")
          //             ? node
          //                 .getAttribute("transform")
          //                 .replace("translate(", "")
          //                 .replace(")", "")
          //                 .trim()
          //                 .split(",")
          //                 .map((e) => {
          //                   return Number(e);
          //                 })
          //             : [0, 0],
          //         });
          //       });
          //       const filteredNode = nodeElementsArr.filter((node) => {
          //         return (
          //           node.coordinate[0] <= dummyCoordinate[0] &&
          //           dummyCoordinate[0] <=
          //             node.coordinate[0] + defaultNodeWidth &&
          //           node.coordinate[1] <= dummyCoordinate[1] &&
          //           dummyCoordinate[1] <= node.coordinate[1] + defaultNodeHeight
          //         );
          //       });

          //       // const nodeCoordinate = document
          //       //   .getElementById(filteredNode[0].id)
          //       //   .getAttribute("transform")
          //       //   .replace("translate(", "")
          //       //   .replace(")", "")
          //       //   .trim()
          //       //   .split(",")
          //       //   .map((e) => {
          //       //     return Number(e);
          //       //   });
          //       // console.log(nodeCoordinate);

          //       // const portElements = document.querySelectorAll(".port");
          //       // let portElementsArr = [];
          //       // portElements.forEach((port) => {
          //       //   portElementsArr.push({
          //       //     id: port.id.replace("sprotty-container_port-", ""),
          //       //     coordinate: port.getAttribute("transform")
          //       //       ? port
          //       //           .getAttribute("transform")
          //       //           .replace("translate(", "")
          //       //           .replace(")", "")
          //       //           .trim()
          //       //           .split(",")
          //       //           .map((e) => {
          //       //             return Number(e);
          //       //           })
          //       //       : [0, 0],
          //       //   });
          //       // });
          //       // const portElementsArrFiltered = portElementsArr.filter((e) => {
          //       //   return (
          //       //     !e.id.includes("dummy") &&
          //       //     e.id.includes(
          //       //       filteredNode[0].id.replace("sprotty-container_node-", "")
          //       //     )
          //       //   );
          //       // });
          //       // console.log(portElementsArrFiltered);

          //       const idPortArr = [];
          //       const portElements = document.querySelectorAll(".port");
          //       portElements.forEach((port) => {
          //         idPortArr.push(
          //           port.id.replace("sprotty-container_node-", "")
          //         );
          //       });

          //       const idPortArrFiltered = idPortArr.filter((id) => {
          //         return id.includes(
          //           filteredNode[0].id.replace("sprotty-container_node-", "")
          //         );
          //       });

          //       idPortArrFiltered.forEach((portId) => {
          //         const portSelected = document.getElementById(portId);

          //         portSelected.classList.add("ready-draw");

          //         portSelected.addEventListener("click", drawMainEdge);
          //       });
          //     });
          //   }, 100);
          // }
        });
      });
    }, 100);
  };

  // add node
  addNode1Btn.addEventListener("click", () => {
    addNode(
      modelSource,

      `type-1-${node1Number}`,
      defaultNodeWidth,
      defaultNodeHeight,
      label1Id,
      1,
      defaultPortWidth,
      defaultPortHeight
    );
    node1Number++;
    label1Id++;
    drawLogic();
  });

  addNode2Btn.addEventListener("click", () => {
    addNode(
      modelSource,

      `type-2-${node2Number}`,
      defaultNodeWidth,
      defaultNodeHeight,
      label2Id,
      2,
      defaultPortWidth,
      defaultPortHeight
    );
    node2Number++;
    label2Id++;
    drawLogic();
  });
  addNode3Btn.addEventListener("click", () => {
    console.log(graph.children);
    addNode(
      modelSource,

      `type-3-${node3Number}`,
      defaultNodeWidth,
      defaultNodeHeight,
      label3Id,
      3,
      defaultPortWidth,
      defaultPortHeight
    );
    node3Number++;
    label3Id++;
    drawLogic();
  });
  addNode4Btn.addEventListener("click", () => {
    addNode(
      modelSource,

      `type-4-${node4Number}`,
      defaultNodeWidth,
      defaultNodeHeight,
      label4Id,
      4,
      defaultPortWidth,
      defaultPortHeight
    );
    node4Number++;
    label4Id++;
    drawLogic();
  });
  // draw mode
  drawEdgeBtn.addEventListener("click", () => {
    if (drawMode === false) {
      addNode1Btn.setAttribute("disabled", "");
      addNode2Btn.setAttribute("disabled", "");
      addNode3Btn.setAttribute("disabled", "");
      addNode4Btn.setAttribute("disabled", "");
      drawEdgeBtn.classList.add("btn-active");
      deleteEdgeBtn.setAttribute("disabled", "");
      cancelBtn.classList.remove("hide");
      drawMode = true;

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
}
document.addEventListener("DOMContentLoaded", () => run());
