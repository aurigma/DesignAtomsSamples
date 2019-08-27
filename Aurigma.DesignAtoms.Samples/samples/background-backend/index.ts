import { JsonProductSerializer } from "@aurigma/design-atoms/Model/Product/Serializer/JsonProductSerializer";
import { Product } from "@aurigma/design-atoms/Model/Product";
import { Helper } from "../../scripts";

const backendUrl = "http://localhost:60669";
const holderElementId = "#viewer";

document.addEventListener("DOMContentLoaded", async () => {
    const holderElement = document.querySelector(holderElementId) as HTMLDivElement;

    const viewer = Helper.initViewer(backendUrl, holderElement);
    const product = await Helper.loadProduct("/api/template/product?filePath=spaceman.psd");

    viewer.surface = product.surfaces.get(0);
    
    const backgroundEditor = new BackgroundEditor();

    (<any>window).designAtoms = {
        viewer: viewer,
        backgroundEditor: backgroundEditor
    };
});

class BackgroundEditor {
    constructor() {
        document.getElementById("white-bg").addEventListener("click", () => this.setBgColor("rgb(255,255,255)"));
        document.getElementById("black-bg").addEventListener("click", () => this.setBgColor("rgb(0,0,0)"));
        document.getElementById("red-bg").addEventListener("click", () => this.setBgColor("rgb(220,0,0)"));
        document.getElementById("green-bg").addEventListener("click", () => this.setBgColor("rgb(62,158,0)"));
        document.getElementById("blue-bg").addEventListener("click", () => this.setBgColor("rgb(0,94,186)"));
        document.getElementById("yellow-bg").addEventListener("click", () => this.setBgColor("rgb(224,163,11)"));
        document.getElementById("purple-bg").addEventListener("click", () => this.setBgColor("rgb(128,32,173)"));

        document.getElementById("first-pic-bg").addEventListener("click", () => this.setBgPicture("~/assets/images/01.jpg"));
        document.getElementById("second-pic-bg").addEventListener("click", () => this.setBgPicture("~/assets/images/02.jpg"));
        document.getElementById("third-pic-bg").addEventListener("click", () => this.setBgPicture("~/assets/images/03.jpg"));

        document.getElementsByClassName("delete-bg-btn")[0].addEventListener('click', this.deleteBgPicture.bind(this));
    }
    
    async setBgColor(color) {
        const viewer = window.designAtoms.viewer;
        const serializer = new JsonProductSerializer();
        const serializedProduct = serializer.serialize(new Product([viewer.surface]));

        const response = await fetch('/api/background/color', {
            method: "POST",

            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },

            body: `{ "product": ${serializedProduct}, "color": ${JSON.stringify(color)} }`
        });

        const data = await response.json();

        const product = serializer.deserialize(data);

        viewer.surface = product.surfaces.get(0);
    }
    
    async setBgPicture(picture) {
        const viewer = window.designAtoms.viewer;
        const serializer = new JsonProductSerializer();
        const serializedProduct = serializer.serialize(new Product([viewer.surface]));

        const response = await fetch("/api/background/picture", {
            method: "POST",

            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },

            body: `{ "Product": ${serializedProduct}, "PicturePath": ${JSON.stringify(picture)} }`
        });

        const data = await response.json();

        const product = serializer.deserialize(data);

        viewer.surface = product.surfaces.get(0);
    }
    
    async deleteBgPicture() {
        const viewer = window.designAtoms.viewer;
        const serializer = new JsonProductSerializer();
        const serializedProduct = serializer.serialize(new Product([viewer.surface]));

        const response = await fetch("/api/background/DeletePicture", {
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
