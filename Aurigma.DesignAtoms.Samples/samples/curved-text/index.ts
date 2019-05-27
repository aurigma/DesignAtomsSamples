import { RectangleF, Path } from "@aurigma/design-atoms/Math";
import { Product, Surface, PrintArea, SurfaceContainer } from "@aurigma/design-atoms/Model/Product";
import { CurvedTextItem } from "@aurigma/design-atoms/Model/Product/Items";
import { assignProperties } from "@aurigma/design-atoms/Utils/Utils";
import { Helper } from "../../scripts/Helper";

const backendUrl = "http://localhost:60669";
const holderElementId = "#viewer";

function createProduct() {
    const product = new Product([new Surface()]);
    product.name = "Curved text product";

    const mainContainer = assignProperties(new SurfaceContainer(), { name: "main" });
    mainContainer.items.add(new CurvedTextItem("Click \"Load from Server\" to fetch a product from server", Path.ellipse(50, 50, 120, 120), "ArialMT", 14));
    mainContainer.items.add(new CurvedTextItem("<p><span style=\"color:blue\">Click </span><span style=\"color:red\">\"Load from Server\" </span><span>to fetch a product from server</span></p>", Path.ellipse(240, 50, 80, 140), "ArialMT", 14));
    const surface = product.surfaces.get(0);

    surface.width = 400;
    surface.height = 400;
    surface.printAreas.add(new PrintArea(new RectangleF(0, 0, 400, 400)));
    surface.containers.setRange([mainContainer]);

    return product;
}

document.addEventListener("DOMContentLoaded", () => {
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

    document.getElementById("load")
        .addEventListener("click", () => Helper.loadProduct("/api/products/curved-text").then(product => viewer.surface = product.surfaces.get(0)));
    
    document.getElementById("add-text")
        .addEventListener("click", () =>
            viewer.surface
            .containers.get(0)
            .items.add(new CurvedTextItem("Lorem ipsum dolor sit amet, consectetur adipiscing elit", Path.rectangle(150, 200, 90, 90), "ArialMT", 14)));

    viewer.surface = createProduct().surfaces.get(0);
});