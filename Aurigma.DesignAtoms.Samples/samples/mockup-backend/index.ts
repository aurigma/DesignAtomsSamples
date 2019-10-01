import { JsonProductSerializer } from "@aurigma/design-atoms/Model/Product/Serializer/JsonProductSerializer";
import { Product } from "@aurigma/design-atoms/Model/Product";
import { Helper, backendUrl } from "../../scripts";

const holderElementId = "#viewer";

document.addEventListener("DOMContentLoaded", async () => {
    const holderElement = document.querySelector(holderElementId) as HTMLDivElement;

    const viewer = Helper.initViewer(backendUrl, holderElement);
    const product = await Helper.loadProduct("../../api/products/mockup");

    viewer.surface = product.surfaces.get(0);
    const mockupEditor = new MockupEditor();

    (<any>window).designAtoms = {
        viewer: viewer,
        mockupEditor: mockupEditor
    };
});

class MockupEditor {
    constructor() {
        document.getElementById("black-mockup").addEventListener("click", () => this.changeMockup("~/assets/mockups/black.jpg"));
        document.getElementById("blue-mockup").addEventListener("click", () => this.changeMockup("~/assets/mockups/blue.jpg"));
        document.getElementById("green-mockup").addEventListener("click", () => this.changeMockup("~/assets/mockups/green.jpg"));
        document.getElementById("red-mockup").addEventListener("click", () => this.changeMockup("~/assets/mockups/red.jpg"));
        document.getElementById("white-mockup").addEventListener("click", () => this.changeMockup("~/assets/mockups/white.jpg"));

        document.getElementById("delete-mockup").addEventListener("click", this.deleteMockup.bind(this));
    }
    
    async changeMockup(mockup: string) {
        const viewer = window.designAtoms.viewer;
        const serializer = new JsonProductSerializer();
        const serializedProduct = serializer.serialize(new Product([viewer.surface]));
        
        const response = await fetch("../../api/mockup/Mockup", {
            method: "POST",

            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },

            body: `{ "Product": ${serializedProduct}, "PicturePath": ${JSON.stringify(mockup)} }`
        });

        const data = await response.json();

        const product = serializer.deserialize(data);

        viewer.surface = product.surfaces.get(0);
    }

    async deleteMockup() {
        const viewer = window.designAtoms.viewer;
        const serializer = new JsonProductSerializer();
        const serializedProduct = serializer.serialize(new Product([viewer.surface]));

        const response = await fetch("../../api/mockup/DeleteMockup", {
            method: "POST",

            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },

            body: serializedProduct
        });

        const data = await response.json();

        const product = serializer.deserialize(data);

        viewer.surface = product.surfaces.get(0);
    }
}
