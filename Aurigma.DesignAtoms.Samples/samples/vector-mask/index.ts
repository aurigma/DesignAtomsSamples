import { Path } from "@aurigma/design-atoms/Math";
import { Product, ItemMask } from "@aurigma/design-atoms/Model/Product";
import { ShapeItem } from "@aurigma/design-atoms/Model/Product/Items";
import { Helper } from "../../scripts/Helper";

const backendUrl = "http://localhost:60669";
const holderElementId = "#viewer";

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

    document.getElementById("set-mask")
        .addEventListener("click", () => {
            const selectedHandlers = viewer.canvas.get_selectedItemHandlers();

            if (selectedHandlers == null)
                return;

            const item = selectedHandlers.get(0).item as ShapeItem;

            if (item.mask != null)
                return;

            const itemBounds = item.sourcePath.bounds;
            const mask = new ItemMask();
            mask.vectorMask = Path.ellipse(itemBounds.left, itemBounds.top, 40, 40);

            item.mask = mask;
        });

    document.getElementById("delete-mask")
        .addEventListener("click", () => {
            const selectedHandlers = viewer.canvas.get_selectedItemHandlers();

            if (selectedHandlers == null || selectedHandlers.get(0).item.mask == null)
                return;

            selectedHandlers.get(0).item.mask = null;
        });

    // Load product from server
    const product = await Helper.loadProduct("/api/products/vector-mask");

    viewer.surface = product.surfaces.get(0);
});