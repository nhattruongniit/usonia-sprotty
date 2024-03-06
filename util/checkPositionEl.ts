export default function checkPositionEl(
  target,
  dummyWidth,
  dummyHeight,
  nodeWidth,
  nodeHeight,
  portWidth,
  portHeight
) {
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
    });

    portCompareCoordinateArr.forEach((portCoordinate) => {
      let portCompareX: number;
      let portCompareY: number;
      if (portCoordinate.type === 1) {
        portCompareX = portCoordinate.nodeX + portCoordinate.x;
        portCompareY = portCoordinate.nodeY + (nodeHeight - portHeight) / 2;
        // console.log("x : " + portCompareX, "y : " + portCompareY, "type 1");
      } else if (portCoordinate.type === 2) {
        portCompareX = portCoordinate.nodeX + (nodeWidth - portWidth) / 2;
        portCompareY = portCoordinate.nodeY + portCoordinate.y;
        // console.log("x : " + portCompareX, "y : " + portCompareY, "type 2");
      } else if (portCoordinate.type === 3) {
        portCompareX = portCoordinate.nodeX + portCoordinate.x;
        portCompareY = portCoordinate.nodeY + (nodeHeight - portHeight) / 2;
        // console.log("x : " + portCompareX, "y : " + portCompareY, "type 3");
      } else if (portCoordinate.type === 4) {
        portCompareX = portCoordinate.nodeX + (nodeWidth - portWidth) / 2;
        portCompareY = portCoordinate.nodeY + portCoordinate.y;
        // console.log("x : " + portCompareX, "y : " + portCompareY, "type 4");
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
    });
  }
  return {
    targetId,
    isDrawable,
    gragphChildrenArr,
  };
}
