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
  const nodeEL = findMax(svgAttArr);
  console.log(svgAttArr);
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

    if (
      portArray[i].x == 0 &&
      portArray[i].y == 0 &&
      portArray[i].width == 0 &&
      portArray[i].height == 0
    ) {
      console.log(portArray[i]);
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
            code: portArray[i].code,
            projectionCssClasses: ["logo-projection"],
          } as ShapedPreRenderedElement & Projectable,
        },
      ]);
    } else {
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
    }

    // if (
    //   (coordinateX > compareX - deviation &&
    //     coordinateX < compareX + deviation) ||
    //   (coordinateY > compareY - deviation &&
    //     coordinateY < compareY + deviation) ||
    //   (coordinateX > nodeEL.x - portWidth - deviation &&
    //     coordinateX < nodeEL.x - portWidth + deviation) ||
    //   (coordinateY > nodeEL.y - portHeight - deviation &&
    //     coordinateY < nodeEL.y - portHeight + deviation)
    // ) {

    // } else {
    //   source.addElements([
    //     {
    //       parentId: nodeId,
    //       element: {
    //         type: "pre-rendered",
    //         id: "custom" + nodeId + i,
    //         position: {
    //           x: 0 - nodeEL.width / 2 + portWidth / 2,
    //           y: 0 - nodeEL.height / 2 - portHeight / 2,
    //         },
    //         code: portArray[i].code,
    //         projectionCssClasses: ["logo-projection"],
    //       } as ShapedPreRenderedElement & Projectable,
    //     },
    //   ]);
    //   console.log(portArray[i].code);
    //   continue;
    // }
  }
}
