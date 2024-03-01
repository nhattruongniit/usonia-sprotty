import { SEdge } from "sprotty-protocol";

type IProps = {
  source: any;
  edgeId: any;
  sourceNumb: number;
  targetNumb: string;
  cssClasses?: string[];
};

export default function drawEdge({
  source,
  edgeId,
  sourceNumb,
  targetNumb,
  cssClasses = [],
}: IProps) {
  source.addElements([
    {
      parentId: "graph",
      element: (<SEdge>{
        type: "edge:straight",
        id: `edge-${edgeId}`,
        sourceId: `port-${sourceNumb}`,
        targetId: `port-${targetNumb}`,
        cssClasses,
        routerKind: "manhattan",
      }) as SEdge,
    },
  ]);
  console.log("draw");
}
