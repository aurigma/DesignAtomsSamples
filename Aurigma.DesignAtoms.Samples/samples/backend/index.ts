import { Viewer } from "@aurigma/design-atoms/Viewer/Viewer";
import { Product, Surface, PrintArea, SafetyLine, SurfaceContainer, MockupContainer } from "@aurigma/design-atoms/Model/Product";
import { RectangleF, PointF } from "@aurigma/design-atoms/Math";
import { RgbColor } from "@aurigma/design-atoms/Colors";
import { assignProperties } from "@aurigma/design-atoms/Utils/Utils";
import { PlainTextItem, TextAlignment, BaseTextItem, TextVerticalAlignment, BoundedTextItem, ImageItem } from "@aurigma/design-atoms/Model/Product/Items";
import { Canvas } from "@aurigma/design-atoms/Canvas";
import { Helper } from "../../scripts/Helper";
import { JsonProductSerializer } from "@aurigma/design-atoms/Model/Product/Serializer/JsonProductSerializer";

export function InitViewer(backendUrl: string, holder: HTMLDivElement) {
    const viewer = new Viewer({
        holderElement: holder,
        backendUrl: backendUrl,
        canvasBackground: { color: "white" }
    });

    viewer.clearSelectionOnDocumentClick = false;
    viewer.rulerScale = 0.0138888889; // inches

    initCanvas(viewer.canvas);

    const product = new Product([new Surface()]);
    product.name = "Sample product";

    initNewSurface(product.surfaces.get(0), backendUrl);

    viewer.surface = product.surfaces.get(0);

    window.designAtoms.viewer = viewer;
}

function initNewSurface(surface: Surface, backendUrl: string) {
    let printArea: PrintArea;
    let mainContainer: SurfaceContainer;

    surface.width = 491.5;
    surface.height = 667.2;

    surface.printAreas.add(
        printArea = new PrintArea(new RectangleF(36, 36, 419.5, 595.2))
    );

    surface.containers.setRange([
        mainContainer = assignProperties(new SurfaceContainer(), { name: "main" })
    ]);

    let titleText: BoundedTextItem;
    mainContainer.items.add(
        titleText = assignProperties(new BoundedTextItem(), {
            name: "header",
            textRectangle: new RectangleF(36, 36, 419.5, 595.2),
            text: "please wait",
            color: new RgbColor("#000000"),
            font: new BaseTextItem.FontSettings("Montserrat-Bold", 24),
            alignment: TextAlignment.Center,
            verticalAlignment: TextVerticalAlignment.Center,
            locked: true
        })
    );
}

function initCanvas(canvas: Canvas) {
    canvas.rotationGripColor = "rgb(255, 255, 255)";
    canvas.rotationGripLineColor = "rgb(48, 194, 255)";
    canvas.rotationGripLineLength = 10;
    canvas.rotationGripSize = 6;

    canvas.selectionColor = "rgb(48, 194, 255)";
    canvas.selectionWidth = 1;
    canvas.loadingImageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAUCAYAAABmvqYOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwVJREFUeNqclE9oE1EQxmeTLGnatGtocqhR04MeClUMVWupJyO5iBTBgAcvIojiqUUoeNOLh0I9Fk9qwYsHL+qhiOCf5CJiMFIUQqxJiAk2aU1MN2k3TfxmfRvW2NjYBz925+3svHnfzHvSzMwM7WBcB1/A4385WToMtgvMmuxb4KzJnt3qJ1uHwV8AD3gPTmqa9hHP3bIs38XzOzgH9oLQ/wT3gSS4AW4j6JTL5dLsdrvKu15fXz+8urpKWITtq+IfB6hsF5y/fQUPwIjT6cz7fL5WH5XnYrGYarVan4g6TADndpp7wTMwZLFY8oODg/oksv8Lv99P8KmyL3jaSUFZjknQjUGJRIKSySRVKhUqFoukqqoemEe1WiVeHHY3zPPbaW4RBbyE7arIijPTg7ndbgoEArpTJBKhXC7HmpPD4WAf1n4aPATf2mXO28uBoCRJalNgZDs2NtZ0Gh0dbWbPo6urq4jHBZDW5WwTfBFcFE6yMckZokOaTtls9o+fhCyvwGX+1yzLUSHHB24lBJLgfGRzc3Mf7B/0W3yan5+n8fFxwo4oHo/rc6ZCd+O/+zDftWp+DB+nuYeh80u8vwZDcP6MbOuY13fJ2obDYT2Y0UG8ABfbUM9cUG56tV6vLwwPDydsNn09DcVRUqlUfz6fH2Ef2M9l1kUE48EHCIeK1tbWKJPJKJiXxc73c7dZg8FgDS8NfDjUaDQ0bis8rRsbG+W+vj5ruVxOYuE7tVrtIJ51o3PgQ5CMlpeXaWVlRUEx7wmte8EjI/Mz4Dgy1gqFAoVCIfJ6vRSNRuV0Oh1XFEVGu00gaRekKAEX11IU2g3teUPcJT+55cFU2z5HMLNpdMoA2MPdZjQKeANOCLsB6lvdH3wn+LHt05BGm5ubI4/Ho2vZ09NDS0tLA8iM+15radVFky21u5y4oDeh9QK0tHPm0Jt1pFKpxAenjOCfRJGMcaqTe9omrkcJBbqGqk/zcYeOWSzWi7kDCKzQDodZ87d82aMDmocIwa/gvR8UdhL8lwADABtmSFbWE/QHAAAAAElFTkSuQmCC";

    canvas.resizeGripLineColor = "rgb(48, 194, 255)";
    canvas.resizeGripColor = "rgb(255, 255, 255)";
    canvas.resizeGripSize = 8;

    canvas.handleButtonCssClass = "cc-icon-placeholder-handle";
    canvas.doneButtonCssClass = "cc-icon-placeholder-done";
}

const backendUrl = "http://localhost:60669";
const holderId = "#viewer";

document.addEventListener("DOMContentLoaded", () => {
    const holder = document.querySelector(holderId) as HTMLDivElement;
    (<any>window).designAtoms = {
        designAtomsBackendUrl: backendUrl,
    }
    InitViewer(backendUrl, holder);

    var helper = new Helper((<any>window).designAtoms.viewer, (<any>window).designAtoms.designAtomsBackendUrl);
    (<any>window).designAtoms["helper"] = helper;

    const saveStateButton = document.getElementById('save-state') as HTMLButtonElement;
    const stateNameInput = document.getElementById('save-state-name') as HTMLInputElement;
    const loadStateButton = document.getElementById('load-state') as HTMLButtonElement;
    const stateSelect = document.getElementById("select-state") as HTMLSelectElement;
    const imageButton = document.getElementById('render-image') as HTMLButtonElement;
    const hiresButton = document.getElementById('render-hires') as HTMLButtonElement;

    function addOptions(select: HTMLSelectElement, options: Array<string>) {
        options.map(option => {
            var optionNode = document.createElement("option");
            optionNode.text = option;
            optionNode.value = option;
            select.add(optionNode);
        })
    }
    function updateStates() {
        while (stateSelect.options.length > 0) {                
            stateSelect.remove(0);
        }   
        fetch('/api/State/AllStates')
            .then(data => data.json())
            .then(data => {
                let states = data.map((state: string) => {
                    return state.substring(state.lastIndexOf('\\') + 1, state.lastIndexOf('.'))
                });
                addOptions(stateSelect, states);
            });
    }

    helper.updateProductViewer("DemoProduct");
    updateStates();

    saveStateButton.addEventListener('click', () => {
        let name = stateNameInput.value;
        helper.saveState(name);
        updateStates();
    })
    loadStateButton.addEventListener('click', () => {
        let name = stateSelect.value;
        helper.loadState(name);
    })
    imageButton.addEventListener('click', () => {
        helper.renderImage();
    })
    hiresButton.addEventListener('click', () => {
        helper.renderHiRes();
    })

});