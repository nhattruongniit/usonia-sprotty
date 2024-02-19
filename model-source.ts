import { SGraph, SPort, SNode, SLabel } from "sprotty-protocol";

let nw = 100;
let nh = 100;

let nx = 100;
let ny = 100;

let pw = 20;
let ph = 20;

export const graph: SGraph = {
  type: "graph",
  id: "graph",

  children: [
    // <SNode>{
    //   type: "node",
    //   id: "node-1",
    //   name: "node-1",
    //   position: { x: nx, y: ny },
    //   size: { width: nw, height: nh },
    //   children: [
    //     <SLabel>{
    //       type: "label:node",
    //       id: "label-1",
    //       text: "abc",
    //       position: { x: nx / 2, y: nw / 2 },
    //     },
    //     <SPort>{
    //       type: "port",
    //       id: "port-1",
    //       size: { width: pw, height: ph },
    //       position: { x: nw, y: nh / 2 - ph / 2 },
    //     },
    //     <SPort>{
    //       type: "port",
    //       id: "port-2",
    //       size: { width: pw, height: ph },
    //       position: { x: nw / 2 - pw / 2, y: nh },
    //     },
    //     <SPort>{
    //       type: "port",
    //       id: "port-3",
    //       size: { width: pw, height: ph },
    //       position: { x: 0 - pw, y: nh / 2 - ph / 2 },
    //     },
    //     <SPort>{
    //       type: "port",
    //       id: "port-4",
    //       size: { width: pw, height: ph },
    //       position: { x: nw / 2 - pw / 2, y: 0 - ph },
    //     },
    //   ],
    // },
  ],
};
