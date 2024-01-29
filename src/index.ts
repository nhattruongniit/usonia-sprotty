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

  // elements
  const addNodeBtn = document.getElementById('add-node');

  const container = createContainer("sprotty-container");
  const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);
  const dispatcher = container.get<IActionDispatcher>(TYPES.IActionDispatcher);

  
  const graph: SGraph = { id: 'graph', type: 'graph', children: initialNodes };
  
  // Run
  modelSource.setModel(graph);

  // // add node
  addNodeBtn.addEventListener('click', function() {
    const newElements = generateNodeItem(count);
    count++;

    modelSource.addElements(newElements);
    // dispatcher.dispatch(SelectAction.create({ selectedElementsIDs: newElements.map(e => e.id) }));
    focusGraph();
  })

  console.log('addNodeBtn: ', addNodeBtn)
}

document.addEventListener("DOMContentLoaded", () => run());