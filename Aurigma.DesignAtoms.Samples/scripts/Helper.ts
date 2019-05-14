import { Viewer } from "@aurigma/design-atoms/Viewer/Viewer";
import { BoundedTextItemHandler, BarcodeItemHandler, BaseRectangleItemHandler } from "@aurigma/design-atoms/ItemHandlers";
import { ImageItem, PlaceholderItem, BarcodeItem, BarcodeFormat, BoundedTextItem, BaseTextItem, FontSettings } from "@aurigma/design-atoms/Model/Product/Items";
import { ZoomMode } from "@aurigma/design-atoms/Viewer/ZoomMode";
import { JsonProductSerializer } from "@aurigma/design-atoms/Model/Product/Serializer/JsonProductSerializer";
import { RectangleF, PointF } from "@aurigma/design-atoms/Math";
import * as $ from "jquery";
import { loadImage } from "./Utils";
import { IResourceUrlMap } from "./IResourceUrlMap";
import { RgbColor } from "@aurigma/design-atoms/Colors";
import { assignProperties } from "@aurigma/design-atoms/Utils/Utils";
import { Product, Surface, PrintArea, SafetyLine, SurfaceContainer, MockupContainer } from "@aurigma/design-atoms/Model/Product";

function downloadUrl(url, file) {
    let link = document.createElement("a");
    link.style.position = "absolute";
    link.style.top = "-99999999";
    link.style.left = "-9999999";
    link.style.visibility = "hidden";
    link.download = file;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export class Helper {
    private _serializer = new JsonProductSerializer();

    constructor(private readonly _viewer: Viewer, private readonly backendUrl: string) {
    }

    async updateText(name: string, text: string) {
        const textItem =
            this._viewer.surface.containers.first().items.first(i => i.name === name) as BaseTextItem;

        textItem.text = text;
    }

    async updateFontSize(name: string, size: number) {
        const textItem =
            this._viewer.surface.containers.first().items.first(i => i.name === name) as BaseTextItem;

        textItem.font = new BaseTextItem.FontSettings(textItem.font.postScriptName, size);
    }

    async updateFontName(name: string, fontName: string) {
        const textItem =
            this._viewer.surface.containers.first().items.first(i => i.name === name) as BaseTextItem;

        textItem.font = new BaseTextItem.FontSettings(fontName, textItem.font.size);
    }

    async updateFontColor(name: string, color: string) {
        const textItem =
            this._viewer.surface.containers.first().items.first(i => i.name === name) as BaseTextItem;

        textItem.color = new RgbColor(color);
    }

    async updateMockup(mockup: string) {
        let mockupImg = assignProperties(new ImageItem(), {
            sourceRectangle: new RectangleF(0, 0, this._viewer.surface.width, this._viewer.surface.height),
            source: new ImageItem.ImageSource(null, this.backendUrl + "/assets/" + mockup + ".png")
        });

        let mockupContainer = new MockupContainer([mockupImg]);

        this._viewer.surface.mockup.overContainers.removeAt(0);
        this._viewer.surface.mockup.overContainers.add(mockupContainer);
    }

    async updateProductViewer(productName: string) {
        fetch(`/api/Generate/${productName}`)
            .then(data => data.json())
            .then(data => {
                const product = this._serializer.deserialize(data);
                this._viewer.surface = product.surfaces.get(0);
            });
    }

    async renderImage() {
        const surface = this._viewer.surface;
        const product = new Product([surface]);
        const req = this._serializer.serialize(product);
        fetch('/api/Render/jpg', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: `{ product: ${req} }`
        })
            .then(data => data.blob())
            .then(data => {
                var blobUrl = URL.createObjectURL(data);
                downloadUrl(blobUrl, 'preview.jpg');
            });
    }

    async renderHiRes() {
        const surface = this._viewer.surface;
        const product = new Product([surface]);
        const req = this._serializer.serialize(product);
        fetch('/api/Render/pdf', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: `{ product: ${req} }`
        })
            .then(data => data.blob())
            .then(data => {
                var blobUrl = URL.createObjectURL(data);
                downloadUrl(blobUrl, 'hires.pdf');
            });
    }

    async saveState(id: string) {
        const surface = this._viewer.surface;
        const product = new Product([surface]);
        const req = this._serializer.serialize(product);
        fetch(`/api/State/Serialize/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: `{ product: ${req} }`
        })
            .then(data => {
                console.log(data);
            });
    }
    async loadState(id: string) {
        fetch(`/api/State/Deserialize/${id}`)
            .then(data => data.json())
            .then(data => {
                const product = this._serializer.deserialize(data);
                this._viewer.surface = product.surfaces.get(0);
            });
    }
}