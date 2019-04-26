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

export class Helper {

    constructor(private readonly _viewer: Viewer, private readonly backendUrl: string) {
    }

    async updateText(name:string, text: string) {
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
            source: new ImageItem.ImageSource(null, this.backendUrl + "/assets/" + mockup +".png")
        });

        let mockupContainer = new MockupContainer([mockupImg]);


        this._viewer.surface.mockup.overContainers.removeAt(0);
        this._viewer.surface.mockup.overContainers.add(mockupContainer);
    }
}