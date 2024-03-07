let graphImport = null

export default function jsonFile(file) {
    function handleFileLoad(event) {
        console.log(event.target.result);
        graphImport = event.target.result
    }
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(file);
    }

export const graph: any = graphImport;

