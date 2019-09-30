import { BaseTextItemHandler, OpenTypeFeature } from "@aurigma/design-atoms/ItemHandlers/BaseTextItemHandler";
import { Helper, backendUrl } from "../../scripts";

const holderElementId = "#viewer";
const sidebarToggleButtonDownClass = "sidebar__toggle__button__down";
const openTypeFeatureDataSetKey = "otf";

document.addEventListener("DOMContentLoaded", async () => {
    const holderElement = document.querySelector(holderElementId) as HTMLDivElement;

    const viewer = Helper.initViewer(backendUrl, holderElement);

    (<any>window).designAtoms = {
        designAtomsBackendUrl: backendUrl,
        viewer: viewer
    };

    document.getElementById("preview")
        .addEventListener("click", async () => await Helper.render(viewer.surface, "preview.jpg"));

    document.getElementById("hi-res")
        .addEventListener("click", async () => await Helper.render(viewer.surface, "hires.pdf"));

    viewer.canvas.add_selectedItemHandlerChanged(handler => {
        const selectedHandlers = viewer.canvas.get_selectedItemHandlers();

        if (selectedHandlers.length === 0 || !(selectedHandlers.get(0) instanceof BaseTextItemHandler)) {
            resetOtfButtonState();
            return;
        }

        const openTypeFeatures = (<BaseTextItemHandler>selectedHandlers.get(0)).item.font.openTypeFeatures;

        changeOtfButtonState(openTypeFeatures);
    });

    const otfButtons = getOpenTypeFeatureButtons();

    for (let i = 0; i < otfButtons.length; i++) {
        otfButtons[i].addEventListener("click", e => {
            const target = e.target as HTMLElement;

            if (target == null || target.dataset[openTypeFeatureDataSetKey] == null)
                return;

            const selectedHandlers = viewer.canvas.get_selectedItemHandlers();

            if (selectedHandlers.length === 0 || !(selectedHandlers.get(0) instanceof BaseTextItemHandler)) {
                return;
            }
            const textHandler = <BaseTextItemHandler>selectedHandlers.get(0);
            const item = textHandler.item;
            let openTypeFeatures: OpenTypeFeature[] = [];

            const selectedFeatureTag = target.dataset[openTypeFeatureDataSetKey];
            if (!target.classList.contains(sidebarToggleButtonDownClass)) {
                openTypeFeatures = openTypeFeatures.concat(item.font.openTypeFeatures);
                let otf = new OpenTypeFeature();
                otf.tag = selectedFeatureTag;
                otf.value = 1;
                openTypeFeatures.push(otf);
            } else {
                openTypeFeatures = item.font.openTypeFeatures.filter(x => x.tag !== selectedFeatureTag);
            }

            target.classList.toggle(sidebarToggleButtonDownClass);
            item.font.openTypeFeatures = openTypeFeatures;
            textHandler.quickUpdate();
        });
    }

    // Load product from server
    const product = await Helper.loadProduct("../../api/products/open-type-feature");

    viewer.surface = product.surfaces.get(0);
});

function getOpenTypeFeatureButtons() {
    return document.querySelectorAll("#otf a");
}

function changeOtfButtonState(openTypeFeatures: OpenTypeFeature[]) {
    const buttons = getOpenTypeFeatureButtons();

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i] as HTMLElement;

        if (openTypeFeatures.find(f => f.tag === button.dataset[openTypeFeatureDataSetKey]) != null) {
            button.classList.toggle(sidebarToggleButtonDownClass);
        } else {
            button.classList.remove(sidebarToggleButtonDownClass);
        }
    }
}

function resetOtfButtonState() {
    const buttons = getOpenTypeFeatureButtons();

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i] as HTMLElement;

        button.classList.remove(sidebarToggleButtonDownClass);
    }
}