import { ShapedPreRenderedElement, Projectable } from "sprotty-protocol";

type IProps = {
  source: any;
  svgId: string;
  x?: number;
  y?: number;
  type: string;
  code: string;
};

export default function addCustomSVG({
  source,
  svgId,
  code,
  type = "pre-rendered",
  x = Math.floor(Math.random() * 500),
  y = Math.floor(Math.random() * 500),
}: IProps) {
  source.addElements([
    {
      parentId: "graph",
      element: {
        type,
        id: svgId,
        position: { x, y },
        code,
        projectionCssClasses: ["logo-projection"],
      } as ShapedPreRenderedElement & Projectable,
    },
  ]);
}
