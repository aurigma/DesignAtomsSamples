import { Helper, backendUrl } from "../../scripts";

const holderElementId = "#viewer";

document.addEventListener("DOMContentLoaded", async () => {
    const holderElement = <HTMLDivElement>document.querySelector(holderElementId);

    const viewer = Helper.initViewer(backendUrl, holderElement);

    const helper = new Helper(viewer, backendUrl);

    (<any>window).designAtoms = {
        viewer: viewer,
        helper: helper
    };

    const statesElement = document.getElementById("states") as HTMLSelectElement;
    
    document.getElementById("load-state")
        .addEventListener("click", async () => {
            if (statesElement.value !== "") {
                await helper.loadState(statesElement.value);
                await updateFonts(statesElement.value);

            } else {
                alert("Please select state");
            }
        });

    document.getElementById("preview")
        .addEventListener("click", async () => await Helper.render(viewer.surface, "preview.jpg"));

    document.getElementById("hi-res")
        .addEventListener("click", async () => await Helper.render(viewer.surface, "hiRes.pdf"));

    const states = await Helper.getStates();

    updateStates(statesElement, states);

    await helper.loadState(states[0]);
    await updateFonts(states[0]);

    statesElement.selectedIndex = 1;
});

async function updateFonts(state: string) {
    const response = await fetch(`../../api/states/${state}/fonts`);
    const fonts = await response.json();
 
    const fontsListElement = <HTMLTextAreaElement>document.getElementById("fonts");
    fontsListElement.value = fonts.join("\n");

    return fonts;
}

function addOptions(selectElement: HTMLSelectElement, options: string[]) {
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.text = option;
        optionElement.value = option;
        selectElement.add(optionElement);
    });
}

async function updateStates(statesElement: HTMLSelectElement, states: string[]) {
    for (let i = 1; i < statesElement.options.length; i++) {
        statesElement.options[i] = null;
    }

    addOptions(statesElement, states);
}