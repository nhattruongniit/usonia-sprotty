import * as monaco from 'monaco-editor';
// import 'monaco-editor/min/vs/editor/editor.main.css'; 

// Create a div for the editor
const editorDiv = document.createElement('div');
editorDiv.style.width = '800px';
editorDiv.style.height = '600px';
document.body.appendChild(editorDiv);

// Initialize the Monaco Editor
monaco.editor.create(editorDiv, {
  value: `function hello() {
    console.log('Hello, world!');
  }`,
  language: 'javascript'
});