import { SEdge } from "sprotty-protocol";

export default function drawEdge(
  source,
  edgeId,
  sourceNumb,
  targetNumb,
  cssClasses = []
) {
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
}
