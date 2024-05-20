export default function checkPositionEl(
  target,
  dummyWidth,
  dummyHeight,
  nodeWidth,
  nodeHeight,
  portWidth,
  portHeight,
) {
  const NODE_PARENT_WIDTH = nodeWidth * 4;
  const NODE_PARENT_HEIGHT = nodeWidth * 4;
  const PORT_PARENT_WIDTH = NODE_PARENT_WIDTH / 8;
  const PORT_PARENT_HEIGHT = NODE_PARENT_HEIGHT / 8;

  let NODE_CUSTOM_WIDTH: number;
  let NODE_CUSTOM_HEIGHT: number;
  let PORT_CUSTOM_WIDTH: number;
  let PORT_CUSTOM_HEIGHT: number;

  let deviation = 5;

  let isDrawable = false;
  let targetId = "";
  let gragphChildrenArr = [];

  if (target.id === "dummy") {
    const coordinateDummyNodeX = target.position.x + dummyWidth / 2;
    const coordinateDummyNodeY = target.position.y + dummyHeight / 2;
    gragphChildrenArr = target.parent.children;
    let portCompareCoordinateArr = [];

    gragphChildrenArr.forEach((child: any) => {
      if (child.type === "node" && child.id !== "dummy") {
        const nodeChildArr = child.children;
        nodeChildArr.forEach((nodeChild: any) => {
          if (nodeChild.type === "port") {
            let portType = null;

            const portX = nodeChild.position.x;
            const portY = nodeChild.position.y;
            let isCustom = false;
            if (nodeChild.id.includes("port-custom")) {
              isCustom = true;
              NODE_CUSTOM_WIDTH = nodeChild.parent.size.width;
              NODE_CUSTOM_HEIGHT = nodeChild.parent.size.height;
              PORT_CUSTOM_WIDTH = nodeChild.size.width;
              PORT_CUSTOM_HEIGHT = nodeChild.size.height;
              console.log("x", portX, NODE_CUSTOM_WIDTH);
              console.log("y", portY, NODE_CUSTOM_HEIGHT);

              // Adding deviation of 5 units
              if (Math.abs(portX - NODE_CUSTOM_WIDTH) <= deviation) {
                portType = 1;
              } else if (Math.abs(portY - NODE_CUSTOM_HEIGHT) <= deviation) {
                portType = 2;
              } else if (
                Math.abs(portX - (0 - PORT_CUSTOM_WIDTH)) <= deviation
              ) {
                portType = 3;
              } else if (
                Math.abs(portY - (0 - PORT_CUSTOM_HEIGHT)) <= deviation
              ) {
                portType = 4;
              }
            } else {
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
            }

            portCompareCoordinateArr.push({
              x: portX,
              y: portY,
              id: nodeChild.id,
              nodeX: nodeChild.parent.position.x,
              nodeY: nodeChild.parent.position.y,
              type: portType,
              isCustom,
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

    console.log(portCompareCoordinateArr);

    portCompareCoordinateArr.forEach((portCoordinate) => {
      let portCompareX: number;
      let portCompareY: number;
      let currentPortWidth = portCoordinate.isCustom
        ? PORT_CUSTOM_WIDTH
        : portWidth;
      let currentPortHeight = portCoordinate.isCustom
        ? PORT_CUSTOM_HEIGHT
        : portHeight;
      let currentNodeWidth = portCoordinate.isCustom
        ? NODE_CUSTOM_WIDTH
        : nodeWidth;
      let currentNodeHeight = portCoordinate.isCustom
        ? NODE_CUSTOM_HEIGHT
        : nodeHeight;

      if (portCoordinate.type === 1) {
        portCompareX = portCoordinate.nodeX + portCoordinate.x;
        portCompareY =
          portCoordinate.nodeY + (currentNodeHeight - currentPortHeight) / 2;
      } else if (portCoordinate.type === 2) {
        portCompareX =
          portCoordinate.nodeX + (currentNodeWidth - currentPortWidth) / 2;
        portCompareY = portCoordinate.nodeY + portCoordinate.y;
      } else if (portCoordinate.type === 3) {
        portCompareX = portCoordinate.nodeX + portCoordinate.x;
        portCompareY =
          portCoordinate.nodeY + (currentNodeHeight - currentPortHeight) / 2;
      } else if (portCoordinate.type === 4) {
        portCompareX =
          portCoordinate.nodeX + (currentNodeWidth - currentPortWidth) / 2;
        portCompareY = portCoordinate.nodeY + portCoordinate.y;
      } else if (portCoordinate.type === 5) {
        portCompareX = portCoordinate.nodeX + portCoordinate.x;
        portCompareY =
          portCoordinate.nodeY + (NODE_PARENT_HEIGHT - PORT_PARENT_HEIGHT) / 2;
      } else {
        return;
      }

      if (
        coordinateDummyNodeX <= portCompareX + currentPortWidth &&
        portCompareX <= coordinateDummyNodeX &&
        coordinateDummyNodeY <= portCompareY + currentPortHeight &&
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
