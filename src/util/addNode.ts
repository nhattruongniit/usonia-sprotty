import { SNode } from "sprotty-protocol";
import { TaskNode } from "../models";

export default function addNode(
  source: any,
  id: any,
  width: number,
  height: number,
  x: number = 100 * (id - 1),
  y: number = 100 * (id - 1),
  name: string = `node-${id}`,
  cssClasses = ["node"]
) {
  source.addElements([
    {
      parentId: "graph",
      element: <SNode & TaskNode>{
        type: "node",
        id: `node-${id}`,
        name,
        cssClasses,
        position: { x, y },
        size: { width, height },
      },
    },
  ]);
}
