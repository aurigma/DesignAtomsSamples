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

    document.getElementById("preview")
        .addEventListener("click", async () => await Helper.render(viewer.surface, "preview.jpg"));

    document.getElementById("hi-res")
        .addEventListener("click", async () => await Helper.render(viewer.surface, "hiRes.pdf"));

    const designsSelectElement = <HTMLSelectElement>document.getElementById("designs");

    document.getElementById("load-design")
        .addEventListener("click", async () => {
            const selectedDesign = designsSelectElement.selectedOptions[0].value;

            if (selectedDesign !== "") {
                const url = `../../api/template/product?filePath=${selectedDesign}`;

                const product = await Helper.loadProduct(url);

                window.designAtoms.viewer.surface = product.surfaces.get(0);
            } else {
                alert("Please select design");
            }
        });

    const response = await fetch("../../api/template/designs");
    const designs: { name: string, path: string }[] = await response.json();

    designs.forEach(d => {
        const optionElement = document.createElement("option");
        optionElement.text = d.name;
        optionElement.value = d.path;
        designsSelectElement.add(optionElement);
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