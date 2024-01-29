import "reflect-metadata";
import { LocalModelSource, TYPES } from 'sprotty';
import { createContainer } from './di.config';
import { graph } from './model-source';

export default function run() {
    // elements
    const addNodeBtn = document.getElementById('add-node');

    const container = createContainer("sprotty-container");
    const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);
    modelSource.setModel(graph);

    console.log('addNodeBtn: ', addNodeBtn)


}

document.addEventListener("DOMContentLoaded", () => run());