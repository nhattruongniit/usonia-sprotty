import "reflect-metadata";
import { IActionDispatcher, LocalModelSource, TYPES } from 'sprotty';
import { createContainer } from './di.config';
// import { graph } from './model-source';

// utils
import { generateNodeItem } from "./utils/addNode";
import { SGraph, SelectAction } from "sprotty-protocol";

// mock data
import { initialNodes } from "./initialNodes";

function focusGraph(): void {
  const graphElement = document.getElementById('graph');
  if (graphElement !== null && typeof graphElement.focus === 'function')
      graphElement.focus();
}

export default function run() {
  // variables
  let count: number = 2;
  let dummyCount: number = 1;

  // elements
  const addNodeBtn = document.getElementById('add-node');
  const addPortBtn = document.getElementById('add-port');
  const addDummyNodeBtn = document.getElementById('add-dummy-node');
  const showJsonBtn = document.getElementById('show-json');
  // const drawEdgeBtn = document.getElementById

  const container = createContainer("sprotty-container");
  const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);
  const dispatcher = container.get<IActionDispatcher>(TYPES.IActionDispatcher);

  
  const graph: SGraph = { 
    id: 'graph',
    type: 'graph', 
    layoutOptions: { 'algorithm': 'layered' },
    children: initialNodes,
  };
  
  // Run
  modelSource.setModel(graph);

  // add node
  addNodeBtn.addEventListener('click', function() {
    const newElements = generateNodeItem(count);
    count++;

    console.log('addNodeBtn: ', newElements)

    modelSource.addElements(newElements);
    dispatcher.dispatch(SelectAction.create({ selectedElementsIDs: newElements.map(e => e.id) }));
    focusGraph();
  })

  // add dummy node
  addDummyNodeBtn.addEventListener('click', async () => {
    const selectedNode: any = await modelSource.getSelection();
    const idNodeSelected = selectedNode[0].id;

    const newDummyNode: any = {
      type: "node:dummy",
      id: `dummy-node${dummyCount}`,
      selected: false,
      cssClasses: ["node"],
      position: { x: 0, y: 100 * (dummyCount - 1) },
      size: { width: 10, height: 10 },
    }
    const newDummyEdge: any = {
      type: "edge:straight",
      id: `edge-${idNodeSelected}-dummy-node${dummyCount}`,
      sourceId: idNodeSelected,
      targetId: `dummy-node${dummyCount}`,
    }
    dummyCount++;

    modelSource.addElements([newDummyNode, newDummyEdge]);
    focusGraph();
  })

  // add port
  addPortBtn.addEventListener('click', async function() {
    // how to detect which node is selected?
    const graph = modelSource.model;
    const selectedNode: any = await modelSource.getSelection();
    const idPort = Math.floor(Math.random() * 100);
    const idNode = selectedNode[0].id;

    const newPort = {
      id: `port-${idNode}-port${idPort}`,
      type: 'port:dummy',
      position: { x: selectedNode[0].size.width + 10, y: selectedNode[0].size.height / 2},
      size: { width: 10, height: 10   },
      cssClasses: ['port']
    }

    const newEdge = {
      type: "edge:straight",
      id: `edge-${idNode}-port-${idNode}-port${idPort}`,
      sourceId: 'portX',
      targetId: `port-${idNode}-port${idPort}`,
    }
    // modelSource.addElements([newPort]);
    const nodeItem = graph.children.find((item: any) => item.id === idNode);
    nodeItem.children.push(newPort);

    graph.children.push(newEdge);

    // // how to update the model?
    modelSource.setModel(graph);
    // dispatcher.dispatch(SelectAction.create({ selectedElementsIDs: [newPort.id] }));
    // focusGraph();
  })

  // show json
  showJsonBtn.addEventListener('click', function() {
    console.log('showJsonBtn: ', modelSource.model)
  })
}

document.addEventListener("DOMContentLoaded", () => run());