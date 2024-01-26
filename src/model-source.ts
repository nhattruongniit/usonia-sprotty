// import { SGraph, SEdge, SNode } from "sprotty-protocol";
// import { TaskNode } from "./models";

export const graph: any = {
  type: 'graph',
  id: 'graph',
  layoutOptions: {
    hGap: 50,
    vGap: 50
  },
  children: [
    {
      type: 'node',
      id: 'node1',
      name: 'Node 1',
      isFinished: true,
      isRunning: false,
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      children: [
        // {
        //     type: "label:node",
        //     id: "node1_label",
        //     text: "0"
        // },
        {
          type: "port",
          id: "port0-0",
          size: {
            width: 8,
            height: 8
          },
          children: [
            {
              type: "label:port",
              id: "port0-0-label",
              text: "in0"
            }
          ]
        },
      ]
    },
    {
      type: 'node',
      id: 'node2',
      name: 'Node 2',
      isFinished: false,
      isRunning: true,
      position: { x: 0, y: 200 },
      size: { width: 100, height: 100 }
    },
    {
      type: 'node',
      id: 'dummynode',
      name: 'Dummy node',
      isFinished: false,
      isRunning: true,
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 }
    },
    {
      type: 'node',
      id: 'node3',
      name: 'Node 3',
      isFinished: false,
      isRunning: false,
      position: { x: 150, y: 0 },
      size: { width: 100, height: 100 },
      children: [
        {
          type: "port",
          id: "port3-3",
          size: {
            width: 8,
            height: 8
          },
          children: [
            {
              type: "label:port",
              id: "port3-3-label",
              text: "out3"
            }
          ]
        },
      ]
    },
    {
      type: 'edge',
      id: 'edge01',
      sourceId: 'port0-0',
      targetId: 'port3-3',
    },
  ],
};