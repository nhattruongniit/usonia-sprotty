export const initialNodes = [
  { 
    id: 'node0', 
    type: 'node', 
    name: 'Node 1',
    position: { x: 0, y: 0 }, 
    size: { width: 100, height: 100 }
  },
  { 
    id: 'nodeX', 
    type: 'node', 
    name: 'Node X',
    position: { x: 100, y: 100 }, 
    size: { width: 100, height: 100 }
  },
  {
    type: "edge:straight",
    id: `edge-node0-nodeX`,
    sourceId: `node0`,
    targetId: `nodeX`,
    routerKind: "manhattan",
  }
  // {
  //   type: 'node',
  //   id: 'dummynode',
  //   name: 'Dummy node',
  //   isFinished: false,
  //   isRunning: true,
  //   position: { x: 0, y: 0 },
  //   size: { width: 10, height: 10 }
  // },
]
