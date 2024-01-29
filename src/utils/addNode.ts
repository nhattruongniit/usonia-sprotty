import { Bounds, SNode } from "sprotty-protocol";

const NODE_SIZE = 100;

interface INode extends SNode  {
  name: string;
}

export function generateNodeItem(count: number): [INode] {
  const newNode: INode = {
    type: "node",
    id: `node${count}`,
    name: `node ${count}`,
    selected: false,
    cssClasses: ["node"],
    position: { x: 0, y: 100 * (count - 1) },
    size: { width: 100, height: 100 },
  }
  return [newNode];
}