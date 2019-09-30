import { Path } from "@aurigma/design-atoms/Math";
import { ItemMask } from "@aurigma/design-atoms/Model/Product";
import { ShapeItem } from "@aurigma/design-atoms/Model/Product/Items";
import { Helper, backendUrl } from "../../scripts";

const holderElementId = "#viewer";

document.addEventListener("DOMContentLoaded", async () => {
    const holderElement = document.querySelector(holderElementId) as HTMLDivElement;

    const viewer = Helper.initViewer(backendUrl, holderElement);
    (<any>window).designAtoms = {
        viewer: viewer
    };

    document.getElementById("preview")
        .addEventListener("click", async () => await Helper.render(viewer.surface, "preview.jpg"));

    document.getElementById("hi-res")
        .addEventListener("click", async () => await Helper.render(viewer.surface, "hires.pdf"));

    document.getElementById("set-mask")
        .addEventListener("click", () => {
            const selectedHandlers = viewer.canvas.get_selectedItemHandlers();

            if (selectedHandlers == null)
                return;

            const item = selectedHandlers.get(0).item as ShapeItem;

            const itemBounds = item.sourcePath.bounds;
            const mask = new ItemMask();
            mask.vectorMask = Path.ellipse(itemBounds.left, itemBounds.top, itemBounds.width, itemBounds.height);

            item.mask = mask;
        });

    document.getElementById("delete-mask")
        .addEventListener("click", () => {
            const selectedHandlers = viewer.canvas.get_selectedItemHandlers();

            if (selectedHandlers == null || selectedHandlers.get(0).item.mask == null)
                return;

            selectedHandlers.get(0).item.mask.vectorMask = null
        });

    // Load product from server
    const product = await Helper.loadProduct("../../api/products/vector-mask");

    viewer.surface = product.surfaces.get(0);
});