export const initialNodes = [
  { 
    id: 'nodeX', 
    type: 'node', 
    name: 'Node X',
    position: { x: 0, y: 0 }, 
    size: { width: 100, height: 100 },
    children: [
      { 
        id: 'portX', 
        type: 'port:dummy', 
        size: { width: 10, height: 10 },
        position: { x: 100, y: 50 }, // WEST position
      },
    ]
  },
  { 
    id: 'nodeY', 
    type: 'node', 
    name: 'Node Y',
    position: { x: 150, y: 0 }, 
    size: { width: 100, height: 100 }
  },
  // { 
  //   id: 'nodeZ', 
  //   type: 'node', 
  //   name: 'Node Z',
  //   position: { x: 150, y: 150 }, 
  //   size: { width: 100, height: 100 }
  // },
  // {
  //   type: "edge:straight",
  //   id: `edge-portX-nodeY`,
  //   sourceId: `portX`,
  //   targetId: `nodeY`,
  // },
  // {
  //   type: "edge:straight",
  //   id: `edge-nodeX-nodeZ`,
  //   sourceId: `nodeX`,
  //   targetId: `nodeZ`,
  // },
 

  // { 
  //   id: 'port1', 
  //   type: 'port:dummy', 
  //   position: { x: 100, y: 50 }, 
  //   size: { width: 10, height: 10 }
  // },
  // { 
  //   id: 'portX', 
  //   type: 'port:dummy', 
  //   position: { x: 175, y: 140 }, 
  //   size: { width: 10, height: 10 }
  // },
  
]

