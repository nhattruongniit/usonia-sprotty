import { SLabel } from "sprotty-protocol";

export function generateInputElements(
  portGeneratedArr: any[],
  containerId: string,
  source: any,
  nodeId: string,
) {
  const closeModalBtnEl = document.getElementById("close-modal-btn");
  const svgTextEl = document.getElementById("area_field_svg");
  const addCustomSVGEl = document.getElementById("add-custom-svg");
  const container = document.getElementById(containerId);
  if (portGeneratedArr.length === 0) {
    window.alert("No ports found. Please insert another SVG!!!");
    source.removeElements([
      {
        elementId: nodeId,
        parentId: "graph",
      },
    ]);
    return;
  }
  if (!container) {
    console.error("Container not found");
    return;
  }
  addCustomSVGEl.classList.add("d-none");
  // Clear existing inputs if necessary
  container.innerHTML = "";

  // Create and append input elements for each port ID

  portGeneratedArr.forEach((port, index) => {
    const fieldPortElement = document.createElement("div");
    const inputElement = document.createElement("input");
    const labelElement = document.createElement("span");

    inputElement.type = "text";
    inputElement.placeholder = `Enter value for ${port.id}`;
    inputElement.id = `input-${port.id}`;
    inputElement.className = "form-control mb-2 mt-2"; // Optional: for styling purposes

    labelElement.innerHTML = `Port ${index + 1}:`;
    labelElement.className = "flex-shrink-0 me-2";

    fieldPortElement.className = "d-flex align-items-center mt-2";
    fieldPortElement.appendChild(labelElement);
    fieldPortElement.appendChild(inputElement);

    container.appendChild(fieldPortElement);
  });

  // Create a submit button
  const divSubmitButton = document.createElement("div");
  divSubmitButton.className = "d-flex justify-content-end mt-2";
  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.id = "submit-button";
  submitButton.className = "btn btn-primary";
  submitButton.addEventListener("click", () => {
    const inputTextArr = [];
    portGeneratedArr.forEach((port) => {
      const inputElement = document.getElementById(
        `input-${port.id}`,
      ) as HTMLInputElement;
      if (inputElement) {
        inputTextArr.push({
          textValue: inputElement.value,
          portId: port.id,
          width: port.width,
          height: port.height,
        });
        // Optionally remove each input element immediately after processing
        inputElement.remove();

        closeModalBtnEl?.click();
        addCustomSVGEl.classList.remove("d-none");
        (svgTextEl as HTMLInputElement).value = "";
      } else {
        console.error(`Input element for ${port.id} not found`);
      }
    });

    // Process the collected data as needed
    inputTextArr.forEach((port) => {
      source.addElements([
        {
          parentId: port.portId,
          element: <SLabel>{
            type: "label:port",
            id: `label-${port.portId}`,
            text: port.textValue,
            position: { x: port.width / 2, y: 0 - port.height / 8 },
          },
        },
      ]);
    });

    // Clear the container after processing all inputs
    container.innerHTML = "";
  });
  divSubmitButton.appendChild(submitButton);
  container.appendChild(divSubmitButton);
}
