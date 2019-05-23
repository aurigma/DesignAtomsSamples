import { Viewer } from "@aurigma/design-atoms/Viewer";
import { Canvas } from "@aurigma/design-atoms/Canvas";
import { BaseTextItemHandler } from "@aurigma/design-atoms/ItemHandlers";
import { Product } from "@aurigma/design-atoms/Model/Product";
import { Helper } from "../../scripts/Helper";

const backendUrl = "http://localhost:60669";
const holderElementId = "#viewer";
const sidebarToggleButtonDownClass = "sidebar__toggle__button__down";
const openTypeFeatureDataSetKey = "otf";

function getOpenTypeFeatureButtons() {
    return document.querySelectorAll("#otf a");
}

function changeOtfButtonState(openTypeFeatures: string[]) {
    const buttons = getOpenTypeFeatureButtons();

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i] as HTMLElement;

        if (openTypeFeatures.find(f => f === button.dataset[openTypeFeatureDataSetKey]) != null) {
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

document.addEventListener("DOMContentLoaded", async () => {
    const holderElement = document.querySelector(holderElementId) as HTMLDivElement;

    const viewer = Helper.initViewer(backendUrl, holderElement);

    (<any>window).designAtoms = {
        designAtomsBackendUrl: backendUrl,
        viewer: viewer
    };

    document.getElementById("preview")
        .addEventListener("click", () => Helper.render("/api/Render/jpg", new Product([viewer.surface]), "preview.jpg"));

    document.getElementById("hi-res")
        .addEventListener("click", () => Helper.render("/api/Render/pdf", new Product([viewer.surface]), "hires.pdf"));

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

            const item = (<BaseTextItemHandler>selectedHandlers.get(0)).item;
            let openTypeFeatures = [];

            const selectedFeature = target.dataset[openTypeFeatureDataSetKey];

            if (!target.classList.contains(sidebarToggleButtonDownClass)) {
                openTypeFeatures = openTypeFeatures.concat(item.font.openTypeFeatures);
                openTypeFeatures.push(selectedFeature);

            } else {
                openTypeFeatures = item.font.openTypeFeatures.filter(x => x !== selectedFeature);
            }

            target.classList.toggle(sidebarToggleButtonDownClass);
            item.font.openTypeFeatures = openTypeFeatures;
        });
    }

    // Load product from server
    const product = await Helper.loadProduct("/api/products/open-type-feature");

    viewer.surface = product.surfaces.get(0);
});