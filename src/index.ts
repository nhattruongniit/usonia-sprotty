import "reflect-metadata";
import { LocalModelSource, TYPES } from 'sprotty';
import { createContainer } from './di.config';
import { graph } from './model-source';

export default function run() {
    const container = createContainer("sprotty-container");
    const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);
    modelSource.setModel(graph);
}

document.addEventListener("DOMContentLoaded", () => run());