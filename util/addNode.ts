import { SNode, SLabel, SPort } from "sprotty-protocol";

export default function addNode(
  source: any,
  nodeId: any,
  nodeWidth: number,
  nodeHeight: number,
  labelId,
  portQuantity: number,
  portWidth,
  portHeight,
  cssClasses = ["node"],
  name: string = `node-${nodeId}`,
  x = Math.floor(Math.random() * 500),
  y = Math.floor(Math.random() * 500)
) {
  let portArr = [];
  let positionPortArr = [
    { x: nodeWidth, y: nodeHeight / 2 - portHeight / 2 },
    { x: nodeWidth / 2 - portWidth / 2, y: nodeHeight },
    { x: 0 - portWidth, y: nodeHeight / 2 - portHeight / 2 },
    { x: nodeWidth / 2 - portWidth / 2, y: 0 - portHeight },
  ];

  source.addElements([
    {
      parentId: "graph",
      element: <SNode>{
        type: "node",

        id: `node-${nodeId}`,
        cssClasses,
        position: {
          x,
          y,
        },
        size: { width: nodeWidth, height: nodeHeight },
        children: [
          <SLabel>{
            type: "label:node",
            id: `label-${nodeId}-${labelId}`,
            text: name,
            position: { x: nodeWidth / 2, y: nodeHeight / 2 },
          },
        ],
      },
    },
  ]);
  for (let i = 0; i < portQuantity; i++) {
    source.addElements([
      {
        parentId: `node-${nodeId}`,
        element: <SPort>{
          type: "port",
          id: `port-${nodeId}-${i + 1}`,
          size: { width: portWidth, height: portHeight },
          position: positionPortArr[i],
          cssClasses: ["port"],
        },
      },
    ]);
  }
}
