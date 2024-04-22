import { SNode, SLabel, SPort } from "sprotty-protocol";

type IProps = {
  source: any;
  nodeId: string;
  nodeWidth: number;
  nodeHeight: number;
  portArray: any;
  cssClasses?: string[];
  name?: string;
  x?: number;
  y?: number;
  type: string;
};

export default function addCustomNode({
  source,
  nodeId,
  nodeWidth,
  nodeHeight,
  portArray,
  cssClasses = ["node"],
  name = `${nodeId}`,
  x,
  y,
  type,
}: IProps) {
  //   const positionPort = [
  //     { x: nodeWidth, y: nodeHeight / 2 - portHeight / 2 },
  //     { x: nodeWidth / 2 - portWidth / 2, y: nodeHeight },
  //     { x: 0 - portWidth, y: nodeHeight / 2 - portHeight / 2 },
  //     { x: nodeWidth / 2 - portWidth / 2, y: 0 - portHeight },
  //   ];
  source.addElements([
    {
      parentId: "graph",
      element: <SNode>{
        type,
        id: `${nodeId}`,
        cssClasses,
        position: { x, y },
        size: {
          width: nodeWidth,
          height: nodeHeight,
        },

        children: [
          <SLabel>{
            type: "label:node",
            id: `label-node-${nodeId}`,
            text: name,
            position: { x: x / 2, y: y / 2 - y / 8 },
          },
        ],
      },
    },
  ]);
  for (let i = 0; i < portArray.length; i++) {
    const width = +portArray[i].getAttribute("width");
    const height = +portArray[i].getAttribute("height");
    source.addElements([
      {
        parentId: nodeId,
        element: <SPort>{
          type: "port",
          id: `port-custom-${nodeId}-${i}`,
          size: {
            width,
            height,
          },
          position: {
            x: +portArray[i].getAttribute("x"),
            y: +portArray[i].getAttribute("y"),
          },
          cssClasses: ["port"],
          children: [
            <SLabel>{
              type: "label:port",
              id: `label-port-custom-${nodeId}-${i + 1}`,
              text: `p-${i}`,
              position: { x: width / 2, y: 0 - height / 8 },
            },
          ],
        },
      },
    ]);
  }
}
