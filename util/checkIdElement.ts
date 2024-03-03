const getLength = (arr: any, type: string, idInclude: string) => {
  return arr
    .filter((e: any) => {
      return e.type === type;
    })
    .filter((e: any) => {
      return e.id.includes(idInclude);
    }).length;
};

export default function checkIdElement(graph: any = null) {
  if (!graph) {
    return {
      countIdNodeParent: 1,
      countIdNodeType1: 1,
      countIdNodeType2: 1,
      countIdNodeType3: 1,
      countIdNodeType4: 1,
      countIdEdge: 1,
    };
  }
  return {
    countIdNodeParent: getLength(graph.children, "node", "node-parent") + 1,
    countIdNodeType1: getLength(graph.children, "node", "node-type-1") + 1,
    countIdNodeType2: getLength(graph.children, "node", "node-type-2") + 1,
    countIdNodeType3: getLength(graph.children, "node", "node-type-3") + 1,
    countIdNodeType4: getLength(graph.children, "node", "node-type-4") + 1,
    countIdEdge: getLength(graph.children, "edge", "edge") + 1,
  };
}
