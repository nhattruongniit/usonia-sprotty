import { ShapedPreRenderedElement, Projectable, SNode } from "sprotty-protocol";

type IProps = {
  source: any;
  svgId: string;
  x?: number;
  y?: number;
  type: string;
  code: string;
  nodeId: string;
  cssClasses: string[];
  nodeWidth: number;
  nodeHeight: number;
};

export default function addCustomSVG({
  source,
  svgId,
  code,
  type = "pre-rendered",
  x = Math.floor(Math.random() * 500),
  y = Math.floor(Math.random() * 500),
  nodeId,
  cssClasses = ["node"],
  nodeWidth,
  nodeHeight,
}: IProps) {
  source.addElements([
    {
      parentId: "graph",
      element: <SNode>{
        type: "node",
        id: `${nodeId}`,
        cssClasses,
        position: { x, y },
        size: {
          width: nodeWidth,
          height: nodeHeight,
        },

        children: [],
      },
    },
  ]);
  source.addElements([
    {
      parentId: nodeId,
      element: {
        type,
        id: svgId,
        position: { x: 0, y: 0 },
        code,
        projectionCssClasses: ["logo-projection"],
      } as ShapedPreRenderedElement & Projectable,
    },
  ]);
}
