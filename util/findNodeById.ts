export function findNodeById(model: any, nodeId: string): any | null {
  // Helper function to recursively search for the node
  function search(nodes: any[]): any | null {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }
      if (node.children) {
        const result = search(node.children);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  if (model.children) {
    return search(model.children);
  }
  return null;
}
