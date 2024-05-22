import {
  SNode,
  SLabel,
  SPort,
  ShapedPreRenderedElement,
  Projectable,
} from "sprotty-protocol";
import { findMax } from "./Math/findMax";
import { extractTransformAttribute } from "./getAttributes/getTransformMatrix";

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
  let portGeneratedArr = [];
  const nodeEL = findMax(svgAttArr);

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

  for (let i = 0; i < portArray.length; i++) {
    let deviation = 3;
    let coordinateX = portArray[i].x;
    let coordinateY = portArray[i].y;
    const portWidth = portArray[i].width;
    const portHeight = portArray[i].height;
    const compareX = nodeEL.x + nodeEL.width;
    const compareY = nodeEL.y + nodeEL.height;

    // if (
    //   portArray[i].x == 0 &&
    //   portArray[i].y == 0 &&
    //   portArray[i].width == 0 &&
    //   portArray[i].height == 0
    // ) {
    // } else {
    // }

    if (
      (coordinateX > compareX - deviation &&
        coordinateX < compareX + deviation) ||
      (coordinateY > compareY - deviation &&
        coordinateY < compareY + deviation) ||
      (coordinateX > nodeEL.x - portWidth - deviation &&
        coordinateX < nodeEL.x - portWidth + deviation) ||
      (coordinateY > nodeEL.y - portHeight - deviation &&
        coordinateY < nodeEL.y - portHeight + deviation)
    ) {
      portGeneratedArr.push({
        id: `port-custom-${nodeId}-${i}`,
        width: portWidth,
        height: portHeight,
      });
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
              x: coordinateX - nodeEL.x,
              y: coordinateY - nodeEL.y,
            },
            cssClasses: ["port"],
          }),
        },
      ]);
    } else {
      const transformMatrix = extractTransformAttribute(
        portArray[i].code || "",
      );

      source.addElements([
        {
          parentId: nodeId,
          element: {
            type: "pre-rendered",
            id: "custom" + nodeId + i,
            position: {
              x: portArray[i].rx - nodeEL.x - portArray[i].rx,
              y: portArray[i].ry - nodeEL.y - portArray[i].ry,
            },
            transform: transformMatrix,
            code: portArray[i].code,
            projectionCssClasses: ["logo-projection"],
          } as ShapedPreRenderedElement & Projectable,
        },
      ]);
    }
  }
  return { portGeneratedArr, nodeId };
}
