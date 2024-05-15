import { SLabel } from "sprotty-protocol";

export function generateInputElements(
  portGeneratedArr: any[],
  containerId: string,
  source: any
) {
  const closeModalBtnEl = document.getElementById("close-modal-btn");
  const svgTextEl = document.getElementById("svg-text");
  const addCustomSVGEl = document.getElementById("add-custom-svg");
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container not found");
    return;
  }
  addCustomSVGEl.classList.add("d-none");
  // Clear existing inputs if necessary
  container.innerHTML = "";

  // Create and append input elements for each port ID
  portGeneratedArr.forEach((port) => {
    const inputElement = document.createElement("input");

    inputElement.type = "text";
    inputElement.placeholder = `Enter value for ${port.id}`;
    inputElement.id = `input-${port.id}`;
    inputElement.className = "form-control mb-2"; // Optional: for styling purposes

    container.appendChild(inputElement);
  });

  // Create a submit button
  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.id = "submit-button";
  submitButton.className = "btn btn-primary";
  submitButton.addEventListener("click", () => {
    const inputTextArr = [];
    portGeneratedArr.forEach((port) => {
      const inputElement = document.getElementById(
        `input-${port.id}`
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
        if (svgTextEl instanceof HTMLInputElement) {
          svgTextEl.value = "";
        }
        closeModalBtnEl?.click();
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
  container.appendChild(submitButton);
}
