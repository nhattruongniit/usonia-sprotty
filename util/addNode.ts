import { SNode, SLabel, SPort } from "sprotty-protocol";

type IProps = {
  isParentNode: boolean;
  source: any;
  nodeId: string;
  portQuantity: number;
  portType: string;
  nodeWidth: number;
  nodeHeight: number;
  portWidth: number;
  portHeight: number;
  cssClasses?: string[];
  name?: string;
  x?: number;
  y?: number;
  type: string;
};

const addPortElement = (
  source: any,
  parentId: string,
  portType: string,
  id: string,
  width: number,
  height: number,
  position: object,
  text: string,
) => {
  source.addElements([
    {
      parentId: parentId,
      element: <SPort>{
        type: "port",
        id: id,
        size: { width: width, height: height },
        position: position,
        cssClasses: ["port"],
        children:
          parentId === "dummy"
            ? []
            : [
                <SLabel>{
                  type: "label:port",
                  id: `label-${id}`,
                  text: text,
                  position: { x: width / 2, y: 0 - height / 8 },
                },
              ],
      },
    },
  ]);
};

export default function addNode({
  isParentNode,
  source,
  nodeId,
  portQuantity,
  portType,
  nodeWidth,
  nodeHeight,
  portWidth,
  portHeight,
  cssClasses = ["node"],
  name = `${nodeId}`,
  x = Math.floor(Math.random() * 500),
  y = Math.floor(Math.random() * 500),
  type,
}: IProps) {
  const positionPort = [
    { x: nodeWidth, y: nodeHeight / 2 - portHeight / 2 },
    { x: nodeWidth / 2 - portWidth / 2, y: nodeHeight },
    { x: 0 - portWidth, y: nodeHeight / 2 - portHeight / 2 },
    { x: nodeWidth / 2 - portWidth / 2, y: 0 - portHeight },
  ];
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
        portQuantity,
        children: [
          <SLabel>{
            type: "label:node",
            id: `label-node-${nodeId}`,
            text: name,

            position: isParentNode
              ? { x: nodeWidth / 2, y: nodeHeight / 10 }
              : { x: nodeWidth / 2, y: nodeHeight / 2 },
          },
        ],
      },
    },
  ]);
  if (isParentNode) {
    const nodeChildWidth = nodeWidth / 4;
    const nodeChildHeight = nodeHeight / 4;
    const portChildWidth = portWidth;
    const portChildHeight = portHeight;
    const positionNodeChildren = [
      { x: nodeWidth / 5, y: nodeHeight / 5 },
      {
        x: nodeWidth / 4 + nodeWidth / 3,
        y: nodeHeight / 4 + nodeHeight / 3,
      },
    ];

    for (let i = 0; i < positionNodeChildren.length; i++) {
      source.addElements([
        {
          parentId: `${nodeId}`,
          element: <SNode>{
            type: "node",
            id: `node-child-${nodeId}-${i + 1}`,
            position: positionNodeChildren[i],
            size: {
              width: nodeChildWidth,
              height: nodeChildHeight,
            },
            children: [
              <SLabel>{
                type: "label:node",
                id: `label-child-${nodeId}-${i + 1}`,
                text: `child-${i + 1}`,
                position: {
                  x: nodeWidth / 8,
                  y: nodeHeight / 8,
                },
                cssClasses: ["text-node-child"],
              },
              <SPort>{
                type: "port",
                id: `port-node-child-${nodeId}-${i + 1}-1`,
                size: {
                  width: portChildWidth,
                  height: portChildHeight,
                },
                position: {
                  x: nodeChildWidth,
                  y: nodeChildHeight / 2 - portChildHeight / 2,
                },
                cssClasses: ["port"],

                children: [
                  <SLabel>{
                    type: "label:port",
                    id: `label-port-1-node-child-${nodeId}-${i + 1}`,
                    text: `p-1`,
                    position: {
                      x: portChildWidth / 2,
                      y: 0 - portChildHeight / 8,
                    },
                    cssClasses: ["label-port-node-child"],
                  },
                ],
              },
              <SPort>{
                type: "port",
                id: `port-node-child-${nodeId}-${i + 1}-2`,
                size: {
                  width: portChildWidth,
                  height: portChildHeight,
                },
                position: {
                  x: 0 - portChildWidth,
                  y: nodeChildHeight / 2 - portChildHeight / 2,
                },
                cssClasses: ["port"],

                children: [
                  <SLabel>{
                    type: "label:port",
                    id: `label-port-2-node-child-${nodeId}-${i + 1}`,
                    text: `p-3`,
                    position: {
                      x: portChildWidth / 2,
                      y: 0 - portChildHeight / 8,
                    },
                    cssClasses: ["label-port-node-child"],
                  },
                ],
              },
            ],
          },
        },
      ]);
    }
  }

  const addPort = (position: object, id: string, text: string) => {
    addPortElement(
      source,
      nodeId,
      portType,
      id,
      portWidth,
      portHeight,
      position,
      text,
    );
  };

  if (portQuantity === 1) {
    addPort(
      positionPort[+portType - 1],
      `port-${nodeId}-${portType}`,
      `p-${portType}`,
    );
  } else {
    for (let i = 0; i < portQuantity; i++) {
      addPort(
        positionPort[+portType[i] - 1],
        `port-${nodeId}-${+portType[i]}`,
        `p-${portType[i]}`,
      );
    }
  }
}
