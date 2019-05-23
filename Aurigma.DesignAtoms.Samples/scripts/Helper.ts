import { Viewer } from "@aurigma/design-atoms/Viewer/Viewer";
import { ImageItem, BaseTextItem } from "@aurigma/design-atoms/Model/Product/Items";
import { Canvas } from "@aurigma/design-atoms/Canvas";
import { JsonProductSerializer } from "@aurigma/design-atoms/Model/Product/Serializer/JsonProductSerializer";
import { RectangleF } from "@aurigma/design-atoms/Math";
import { RgbColor } from "@aurigma/design-atoms/Colors";
import { assignProperties } from "@aurigma/design-atoms/Utils/Utils";
import { Product, MockupContainer } from "@aurigma/design-atoms/Model/Product";

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

    static render(url: string, product: Product, fileName: string) {
        const serializedProduct = new JsonProductSerializer().serialize(product);
        fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: `{product: ${serializedProduct}}`
            })
            .then(response => response.blob())
            .then(data => Helper.downloadUrl(URL.createObjectURL(data), fileName));
    }

    static downloadUrl = (url: string, fileName: string) => {
        downloadUrl(url, fileName);
    }

    static configureCanvas(canvas: Canvas) {
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

    static initViewer(backendUrl: string, holderElement: HTMLDivElement) {
        const viewer = new Viewer({
            holderElement: holderElement,
            backendUrl: backendUrl,
            canvasBackground: { color: "white" }
        });

        viewer.clearSelectionOnDocumentClick = false;
        viewer.rulerScale = 0.0138888889; // inches

        Helper.configureCanvas(viewer.canvas);

        return viewer;
    }

    static async loadProduct(url: string) {
        const response = await fetch(url);
        const data = await response.json();

        return new JsonProductSerializer().deserialize(data);
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