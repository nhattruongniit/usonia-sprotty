export default function getGrahpJson(graph: any)  {
  delete graph?.canvasBounds;
  delete graph?.scroll;
  delete graph?.zoom;
  delete graph?.position;
  delete graph?.size;
  delete graph?.features;

  return JSON.stringify(graph, null, 2);
}