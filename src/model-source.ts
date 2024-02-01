import { SGraph } from "sprotty-protocol";

export const graph: any = {
  type: "graph",
  id: "graph",
  cssClasses: ["graph"],

  children: [
    { 
      id: 'node1', 
      type: 'node', 
      name: 'Node 1',
      position: { x: 0, y: 0 }, 
      size: { width: 100, height: 100 },
      children: [
        { 
          id: 'port1', 
          type: 'port', 
          size: { width: 10, height: 10 },
          position: { x: 100, y: 50 }, // WEST position
        },
      ]
    },
  ],
};

