import { Helper, ProductFactory, backendUrl } from "../../scripts";

const holderElementId = "#viewer";

document.addEventListener("DOMContentLoaded", async () => {
    const holderElement = <HTMLDivElement>document.querySelector(holderElementId);

    const viewer = Helper.initViewer(backendUrl, holderElement);
    const product = ProductFactory.createProduct(backendUrl);
    viewer.surface = product.surfaces.get(0);

    const helper = new Helper(viewer, backendUrl);

    (<any>window).designAtoms = {
        viewer: viewer,
        helper: helper
    };
    const statesElement = document.getElementById("states") as HTMLSelectElement;
    
    document.getElementById("save-state")
        .addEventListener("click", async () => {
            const stateNameElement = document.getElementById("state-name") as HTMLInputElement;
            if (stateNameElement.value !== "") {
                await helper.saveState(stateNameElement.value);
                updateStates(statesElement);
                stateNameElement.value = "";
            } else {
                alert("Please enter state name");
            }
        });

    document.getElementById("load-state")
        .addEventListener("click", async () => {
            if (statesElement.value !== "") {
                await helper.loadState(statesElement.value);
            } else {
                alert("Please select state");
            }
        });

    document.getElementById("submit-btn")
        .addEventListener("click", async e => {
            const formData = new FormData();
            var fileSelector = document.getElementById("file-selector") as HTMLInputElement;
            for (let i = 0; i < fileSelector.files.length; i++) {
                formData.append(fileSelector.files[i].name, fileSelector.files[i]);
            }
            var response = await fetch("/api/states/import", {
                method: "POST",
                body: formData
            });
            fileSelector.value = "";
            await updateStates(statesElement);
            var result = await response.json();
            for (let i = 0; i < statesElement.options.length; i++) {
                if (result[0] === statesElement.options[i].value) {
                    statesElement.selectedIndex = i;
                    statesElement.dispatchEvent(new Event('change'));
                    break;
                }
            }
            return false;
        });

    statesElement.addEventListener("change", async () => {
        if (statesElement.selectedOptions[0] && !statesElement.selectedOptions[0].disabled) {
            await helper.loadState(statesElement.value);
        }

    });

    await updateStates(statesElement);
});

function addOptions(selectElement: HTMLSelectElement, options: string[]) {
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.text = option;
        optionElement.value = option;
        selectElement.add(optionElement);
    });
}

async function updateStates(statesElement: HTMLSelectElement) {

    while (statesElement.options.length > 0 && !statesElement.options[statesElement.options.length - 1].disabled) {
        let lastIndex = statesElement.options.length - 1;
        if (!statesElement.options[lastIndex].disabled) {
            statesElement.options.remove(lastIndex);
        }
    }

    const states = await Helper.getStates();

    addOptions(statesElement, states);
}