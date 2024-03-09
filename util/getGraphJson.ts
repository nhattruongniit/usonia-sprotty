function removeIsFeatures(data) {
  // console.log(data);
  if (data) {
    data.forEach((e) => {
      delete e?.features;
      removeIsFeatures(e.children);
    });
  }
}

export default function getGrahpJson(graph: any) {
  delete graph?.canvasBounds;
  delete graph?.scroll;
  delete graph?.zoom;
  delete graph?.position;
  delete graph?.size;
  delete graph?.features;
  removeIsFeatures(graph.children);
  graph.isValidGraph = true;

  return JSON.stringify(graph, null, 2);
}
