let graphImport = null;

export default function jsonFile(file) {
  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = (event) => {
    graphImport = event.target.result;
    console.log(event.target.result);
    return event.target.result;
  };
}

export const graph: any = {
  type: "graph",
  id: "graph",
  children: [],
};
