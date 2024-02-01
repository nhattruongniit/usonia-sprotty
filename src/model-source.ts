import { SGraph } from "sprotty-protocol";

export const graph: any = {
  type: "graph",
  id: "graph",
  cssClasses: ["graph"],
  layoutOptions: { 'algorithm': 'layered' },
  children: [
    { 
      id: 'node1', 
      type: 'node', 
      name: 'Node 1',
      position: { x: 0, y: 0 }, 
      size: { width: 100, height: 100 },
      cssClasses: ['node'],
      children: [
        { 
          id: 'port1-node1', 
          type: 'port', 
          size: { width: 10, height: 10 },
          position: { x: 100, y: 50 }, // WEST position
        },
      ]
    },
    { 
      id: 'node2', 
      type: 'node', 
      name: 'Node 2',
      cssClasses: ['node'],
      position: { x: 0, y: 100 }, 
      size: { width: 100, height: 100 },
      children: [
        { 
          id: 'port1-node2', 
          type: 'port', 
          size: { width: 10, height: 10 },
          position: { x: 100, y: 50 }, // WEST position
        },
        { 
          id: 'port2-node2', 
          type: 'port', 
          size: { width: 10, height: 10 },
          position: { x: 100, y: 50 }, // WEST position
        },
        { 
          id: 'port3-node2', 
          type: 'port', 
          size: { width: 10, height: 10 },
          position: { x: 100, y: 50 }, // WEST position
        },
      ]
    },
    { 
      id: 'node3', 
      type: 'node', 
      name: 'Node 3',
      cssClasses: ['node'],
      position: { x: 0, y: 200 }, 
      size: { width: 100, height: 100 },
      children: [
        { 
          id: 'port1-node3', 
          type: 'port', 
          size: { width: 10, height: 10 },
          position: { x: 100, y: 50 }, // WEST position
        },
        { 
          id: 'port2-node3', 
          type: 'port', 
          size: { width: 10, height: 10 },
          position: { x: 100, y: 50 }, // WEST position
        },
        { 
          id: 'port3-node3', 
          type: 'port', 
          size: { width: 10, height: 10 },
          position: { x: 100, y: 50 }, // WEST position
        },
        { 
          id: 'port4-node3', 
          type: 'port', 
          size: { width: 10, height: 10 },
          position: { x: 100, y: 50 }, // WEST position
        },
      ]
    },
  ],
};

