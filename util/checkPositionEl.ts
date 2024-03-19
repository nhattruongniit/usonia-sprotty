export default function checkPositionEl(
  target,
  dummyWidth,
  dummyHeight,
  nodeWidth,
  nodeHeight,
  portWidth,
  portHeight
) {
  const NODE_PARENT_WIDTH = nodeWidth * 4;
  const NODE_PARENT_HEIGHT = nodeWidth * 4;
  const PORT_PARENT_WIDTH = NODE_PARENT_WIDTH / 8;
  const PORT_PARENT_HEIGHT = NODE_PARENT_HEIGHT / 8;
  let isDrawable = false;
  let targetId = "";
  let gragphChildrenArr = [];
  if (target.id === "node-dummy") {
    const coordinateDummyNodeX = target.position.x + dummyWidth / 2;
    const coordinateDummyNodeY = target.position.y + dummyHeight / 2;
    gragphChildrenArr = target.parent.children;

    let portCompareCoordinateArr = [];

    gragphChildrenArr.forEach((child: any) => {
      if (child.type === "node" && child.id !== "node-dummy") {
        const nodeChildArr = child.children;
        nodeChildArr.forEach((nodeChild: any) => {
          if (nodeChild.type === "port") {
            let portType = null;
            const portX = nodeChild.position.x;
            const portY = nodeChild.position.y;
            if (
              portX === nodeWidth &&
              portY === (nodeHeight - portHeight) / 2
            ) {
              portType = 1;
            } else if (
              portX === (nodeWidth - portWidth) / 2 &&
              portY === nodeHeight
            ) {
              portType = 2;
            } else if (
              portX === 0 - portWidth &&
              portY === (nodeHeight - portHeight) / 2
            ) {
              portType = 3;
            } else if (
              portX === (nodeWidth - portWidth) / 2 &&
              portY === 0 - portHeight
            ) {
              portType = 4;
            }
            portCompareCoordinateArr.push({
              x: portX,
              y: portY,
              id: nodeChild.id,
              nodeX: nodeChild.parent.position.x,
              nodeY: nodeChild.parent.position.y,
              type: portType,
            });
          }
        });
      }
      if (child.type === "node:package") {
        child.children.forEach((packageChild) => {
          if (packageChild.type === "port") {
            portCompareCoordinateArr.push({
              x: packageChild.position.x,
              y: packageChild.position.y,
              id: packageChild.id,
              nodeX: packageChild.parent.position.x,
              nodeY: packageChild.parent.position.y,
              type: 5,
            });
          }
          if (packageChild.type === "node") {
            packageChild.children.forEach((childOfNodeChildren) => {
              if (childOfNodeChildren.type === "port") {
                let portType = null;
                const portX = childOfNodeChildren.position.x;
                const portY = childOfNodeChildren.position.y;
                if (
                  portX === nodeWidth &&
                  portY === (nodeHeight - portHeight) / 2
                ) {
                  portType = 1;
                } else if (
                  portX === (nodeWidth - portWidth) / 2 &&
                  portY === nodeHeight
                ) {
                  portType = 2;
                } else if (
                  portX === 0 - portWidth &&
                  portY === (nodeHeight - portHeight) / 2
                ) {
                  portType = 3;
                } else if (
                  portX === (nodeWidth - portWidth) / 2 &&
                  portY === 0 - portHeight
                ) {
                  portType = 4;
                }

                portCompareCoordinateArr.push({
                  x: portX,
                  y: portY,
                  id: childOfNodeChildren.id,
                  nodeX:
                    childOfNodeChildren.parent.position.x +
                    childOfNodeChildren.parent.parent.position.x,
                  nodeY:
                    childOfNodeChildren.parent.position.y +
                    childOfNodeChildren.parent.parent.position.y,
                  type: portType,
                });
              }
            });
          }
        });
      }
    });

    portCompareCoordinateArr.forEach((portCoordinate) => {
      let portCompareX: number;
      let portCompareY: number;
      if (portCoordinate.type === 1) {
        portCompareX = portCoordinate.nodeX + portCoordinate.x;
        portCompareY = portCoordinate.nodeY + (nodeHeight - portHeight) / 2;
      } else if (portCoordinate.type === 2) {
        portCompareX = portCoordinate.nodeX + (nodeWidth - portWidth) / 2;
        portCompareY = portCoordinate.nodeY + portCoordinate.y;
      } else if (portCoordinate.type === 3) {
        portCompareX = portCoordinate.nodeX + portCoordinate.x;
        portCompareY = portCoordinate.nodeY + (nodeHeight - portHeight) / 2;
      } else if (portCoordinate.type === 4) {
        portCompareX = portCoordinate.nodeX + (nodeWidth - portWidth) / 2;
        portCompareY = portCoordinate.nodeY + portCoordinate.y;
      } else if (portCoordinate.type === 5) {
        portCompareX = portCoordinate.nodeX + portCoordinate.x;
        portCompareY =
          portCoordinate.nodeY + (NODE_PARENT_HEIGHT - PORT_PARENT_HEIGHT) / 2;
      } else {
        return;
      }
      if (
        coordinateDummyNodeX <= portCompareX + portWidth &&
        portCompareX <= coordinateDummyNodeX &&
        coordinateDummyNodeY <= portCompareY + portHeight &&
        portCompareY <= coordinateDummyNodeY
      ) {
        targetId = portCoordinate.id;
        isDrawable = true;
      }
      if (
        coordinateDummyNodeX <= portCompareX + PORT_PARENT_WIDTH &&
        portCompareX <= coordinateDummyNodeX &&
        coordinateDummyNodeY <= portCompareY + PORT_PARENT_HEIGHT &&
        portCompareY <= coordinateDummyNodeY
      ) {
        console.log(portCoordinate.id);
        targetId = portCoordinate.id;
        isDrawable = true;
      }
    });
  }
  return {
    targetId,
    isDrawable,
    gragphChildrenArr,
  };
}
