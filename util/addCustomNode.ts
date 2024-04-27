import {
  SNode,
  SLabel,
  SPort,
  ShapedPreRenderedElement,
  Projectable,
} from "sprotty-protocol";
import { findMax } from "./Math/findMax";

type IProps = {
  source: any;
  nodeId: string;
  svgAttArr: any[];
  cssClasses?: string[];
};

export default function addCustomNode({
  source,
  nodeId,
  svgAttArr,
  cssClasses = ["node"],
}: IProps) {
  //   const positionPort = [
  //     { x: nodeWidth, y: nodeHeight / 2 - portHeight / 2 },
  //     { x: nodeWidth / 2 - portWidth / 2, y: nodeHeight },
  //     { x: 0 - portWidth, y: nodeHeight / 2 - portHeight / 2 },
  //     { x: nodeWidth / 2 - portWidth / 2, y: 0 - portHeight },
  //   ];
  const nodeEL = findMax(svgAttArr);
  console.log(nodeEL);
  const portArray = svgAttArr.filter((svg) => {
    return svg.width !== nodeEL.width;
  });
  source.addElements([
    {
      parentId: "graph",
      element: <SNode>{
        type: "node",
        id: `${nodeId}`,
        cssClasses,
        position: { x: nodeEL.x, y: nodeEL.y },
        size: {
          width: nodeEL.width,
          height: nodeEL.height,
        },

        children: [],
      },
    },
  ]);
  console.log(svgAttArr);
  // console.log(portArray);
  for (let i = 0; i < portArray.length; i++) {
    let deviation = 3;
    let coordinateX = portArray[i].x;
    let coordinateY = portArray[i].y;
    const portWidth = portArray[i].width;
    const portHeight = portArray[i].height;
    const compareX = nodeEL.x + nodeEL.width;
    const compareY = nodeEL.y + nodeEL.height;
    if (
      coordinateX > compareX - deviation &&
      coordinateX < compareX + deviation
    ) {
      coordinateX =
        coordinateX -
        nodeEL.width +
        portWidth / 2 +
        Math.abs(coordinateX - compareX);
      coordinateY = coordinateY - nodeEL.height - portHeight;
    } else if (
      coordinateY > compareY - deviation &&
      coordinateY < compareY + deviation
    ) {
      coordinateX = coordinateX - nodeEL.width + portWidth / 2;
      coordinateY =
        coordinateY -
        nodeEL.height -
        portHeight -
        Math.abs(coordinateY - compareY);
    } else if (
      coordinateX > nodeEL.x - portWidth - deviation &&
      coordinateX < nodeEL.x - portWidth + deviation
    ) {
      coordinateX =
        coordinateX -
        nodeEL.width +
        portWidth -
        Math.abs(coordinateX - (nodeEL.x - portWidth));
      coordinateY = coordinateY - nodeEL.height - portHeight * 2;
    } else if (
      coordinateY > nodeEL.y - portHeight - deviation &&
      coordinateY < nodeEL.y - portHeight + deviation
    ) {
      coordinateX = coordinateX - nodeEL.width + portWidth / 2;
      coordinateY =
        coordinateY -
        nodeEL.height -
        portHeight * 2 -
        Math.abs(coordinateY - (nodeEL.y - portHeight));
    } else {
      source.addElements([
        {
          parentId: nodeId,
          element: {
            type: "pre-rendered",
            id: "custom" + nodeId + i,
            position: {
              x: 0 - nodeEL.width + portWidth / 2,
              y: 0 - nodeEL.height - portHeight,
            },
            code: portArray[i].code,
            projectionCssClasses: ["logo-projection"],
          } as ShapedPreRenderedElement & Projectable,
        },
      ]);
      console.log(portArray[i].code);
      continue;
    }

    source.addElements([
      {
        parentId: nodeId,
        element: <SPort>(<unknown>{
          type: "port",
          id: `port-custom-${nodeId}-${i}`,
          size: {
            width: portArray[i].width,
            height: portArray[i].height,
          },
          position: {
            x: coordinateX,
            y: coordinateY,
          },
          cssClasses: ["port"],
        }),
      },
    ]);
  }
}
