import { SEdge, SLabel, EdgeLayoutable } from "sprotty-protocol";

type IProps = {
  source: any;
  edgeId: any;
  sourceNumb: number;
  targetNumb: string;
  type: string;
  cssClasses?: string[];
};

export default function drawEdge({
  source,
  edgeId,
  sourceNumb,
  targetNumb,
  type,
  cssClasses = [],
}: IProps) {
  source.addElements([
    {
      parentId: "graph",
      element: (<SEdge>{
        type: type,
        id: `edge-${edgeId}`,
        sourceId: `port-${sourceNumb}`,
        targetId: `port-${targetNumb}`,
        cssClasses,
        routerKind: "manhattan",
        children:
          edgeId === "dummy"
            ? []
            : [
                <SLabel & EdgeLayoutable>{
                  type: "label:text",
                  id: `label-edge-${edgeId}`,
                  text: `label-edge-${edgeId}`,
                  edgePlacement: {
                    position: 0.5,
                    offset: 10,
                    side: "top",
                    rotate: false,
                  },
                },
              ],
      }) as SEdge,
    },
  ]);
}
