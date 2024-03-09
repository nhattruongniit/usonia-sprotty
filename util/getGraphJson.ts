function removeIsFeatures(data) {
  if (data.length > 0) {
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

  return JSON.stringify(graph, null, 2);
}

{
  features: {
  }
  children: [
    {
      isFeatures: {},
      children: [{}, {}, {}],
    },
    {},
    {},
  ];
}
