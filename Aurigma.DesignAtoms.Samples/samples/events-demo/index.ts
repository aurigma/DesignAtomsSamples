import { Viewer } from "@aurigma/design-atoms/Viewer/Viewer";
import { Product, Surface, PrintArea, SurfaceContainer, MockupContainer } from "@aurigma/design-atoms/Model/Product";
import { RectangleF, PointF } from "@aurigma/design-atoms/Math";
import { JsonProductSerializer } from "@aurigma/design-atoms/Model/Product/Serializer/JsonProductSerializer";
import { ItemHandler } from "@aurigma/design-atoms/ItemHandlers";
import { RgbColor } from "@aurigma/design-atoms/Colors";
import { BaseItem, BaseTextItem, PlainTextItem, BoundedTextItem, ImageItem, TextAlignment } from "@aurigma/design-atoms/Model/Product/Items";
import { assignProperties } from "@aurigma/design-atoms/Utils/Utils";
import { Helper } from "../../scripts/Helper";

const backendUrl = "http://localhost:60669";
const holderElementId = "#viewer";

document.addEventListener("DOMContentLoaded", () => {
    const holderElement = document.querySelector(holderElementId) as HTMLDivElement;

    const viewer = Helper.initViewer(backendUrl, holderElement);

    const product = createProduct();
    viewer.surface = product.surfaces.get(0);

    const itemsCopy = new Map<string, BaseItem>();
    
    (<any>window).designAtoms = {
        viewer: viewer,
        itemsCopy: itemsCopy,
        textEditor: new TextEditor(new Helper(viewer, backendUrl)),
        logger: new Logger("log"),
        serializer: new JsonProductSerializer()
    };

    viewer.surface.getAllItems().forEach(item => {
        //Save initial state of items
        itemsCopy.set(item.id, item.clone());

        const handler = viewer.getHandler(item);
        handler.addItemPropertyChanged(onItemPropertyChanged);
    });

    viewer.canvas.add_selectedItemHandlerChanged(onSelectedItemsChanged);

    const mainContainer = viewer.surface.containers.get(0);
    mainContainer.items.add_itemAdded(onItemAdded);
    mainContainer.items.add_itemRemoved(onItemRemoved);

    document.getElementById("add-text")
        .addEventListener("click", () =>
            viewer.surface
            .containers.get(0)
                .items.add(assignProperties(new BoundedTextItem(), {
                    name: "New Text",
                    textRectangle: new RectangleF(94.8, 372.15, 301.5, 197.1),
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    color: new RgbColor("#000000"),
                    font: new BaseTextItem.FontSettings("Montserrat-Regular", 14),
                    alignment: TextAlignment.Left,
                    locked: false
            })));
});

function onSelectedItemsChanged(handler: ItemHandler) {
    const viewer: Viewer = (<any>window).designAtoms.viewer;
    const logger: Logger = (<any>window).designAtoms.logger;
    const selectedItems = viewer.selectedItems;
    const textEditor: TextEditor = (<any>window).designAtoms.textEditor;

    if (selectedItems.length === 1) {
        logger.log(`Item '${selectedItems[0].name}' has been selected.`);
    } else if (selectedItems.length > 1) {
        logger.log(`Items '${selectedItems.map(i => i.name).join(", ")}' have been selected.`);
    } else {
        logger.log("No items selected.");
    }

    if (selectedItems.length === 1 && selectedItems[0] instanceof BaseTextItem) {
        textEditor.show(<BaseTextItem>selectedItems[0]);
    }
    else {
        textEditor.hide();
    }
}

function onItemPropertyChanged(sender: ItemHandler, property: string) {
    const itemsCopy: Map<string, BaseItem[]> = (<any>window).designAtoms.itemsCopy;
    const logger: Logger = (<any>window).designAtoms.logger;
    
    const changedProperty = sender.item[property];
    let oldValue = itemsCopy.get(sender.item.id)[property];
    let newValue = changedProperty;

    if (changedProperty instanceof Object) {
        const serializer = (<any>window).designAtoms.serializer;

        oldValue = serializer.serializeModelComponent(oldValue);
        newValue = serializer.serializeModelComponent(newValue);

        oldValue = oldValue != null ? oldValue.replace(/\r?\n|\r/gm, "") : oldValue;
        newValue = newValue != null ? newValue.replace(/\r?\n|\r/gm, "") : newValue;

    } else if (changedProperty instanceof Array) {
        oldValue = oldValue != null ? oldValue.toString() : oldValue;
        newValue = newValue != null ? newValue.toString() : newValue;
    }

    logger.log(`${property} of Item '${sender.item.name}' has been changed. Old value: ${oldValue}; New value: ${newValue}`);

    //Update initial item state
    itemsCopy.get(sender.item.id)[property] = changedProperty;
}

function onItemAdded(data) {
    const logger: Logger = (<any>window).designAtoms.logger;

    logger.log(`Item \"${data.item.name}\" has been added.`);
}

function onItemRemoved(data) {
    const logger: Logger = (<any>window).designAtoms.logger;

    logger.log(`Item \"${data.item.name}\" has been deleted.`);
}

function createProduct() {
    const surface = new Surface();
    const product = new Product([surface]);
    product.name = "Sample product";

    let mainContainer: SurfaceContainer;

    surface.width = 491.5;
    surface.height = 667.2;

    surface.printAreas.add(new PrintArea(new RectangleF(36, 36, 419.5, 595.2)));

    surface.containers.setRange([
        mainContainer = assignProperties(new SurfaceContainer(), { name: "main" })
    ]);

    const mockupImg = assignProperties(new ImageItem(), {
        sourceRectangle: new RectangleF(0, 0, surface.width, surface.height),
        source: new ImageItem.ImageSource(null, backendUrl + "/assets/test-page-square.png")
    });

    surface.mockup.overContainers.add(new MockupContainer([mockupImg]));

    mainContainer.items.add(
        assignProperties(new PlainTextItem(), {
            name: "header",
            baselineLocation: new PointF(95.2, 92.15),
            text: "Just about any kind\nof print product",
            color: new RgbColor("#000000"),
            font: new BaseTextItem.FontSettings("Montserrat-Bold", 24),
            alignment: TextAlignment.Left,
            locked: false
        })
    );

    mainContainer.items.add(
        assignProperties(new BoundedTextItem(), {
            name: "body",
            textRectangle: new RectangleF(94.8, 152.15, 301.5, 197.1),
            text: "Many packaged web-to-print solutions on the market today work well enough, but they can also be rigid and prevent the customizability that many printers want. Customer's Canvas provides an opportunity for printers to get a solution that is better tailored to their internal workflows and give their customers a more unique and intuitive experience.",
            color: new RgbColor("#000000"),
            font: new BaseTextItem.FontSettings("Montserrat-Regular", 15),
            alignment: TextAlignment.Left,
            locked: false
        })
    );

    return product;
}

class TextEditor {
    private _element: HTMLDivElement;
    private _textElement: HTMLTextAreaElement;
    private _colorElement: HTMLInputElement;
    private _sizeElement: HTMLInputElement;
    private _fontsElement: HTMLSelectElement;

    constructor(private _helper: Helper) {
        this._element = <HTMLDivElement>document.getElementById("text-editor");
        this._textElement = <HTMLTextAreaElement>this._element.querySelector(".text-editor__textarea");
        this._colorElement = <HTMLInputElement>this._element.querySelector(".text-editor__color");
        this._sizeElement = <HTMLInputElement>this._element.querySelector(".text-editor__size");
        this._fontsElement = <HTMLSelectElement>this._element.querySelector(".text-editor__select");

        this._element.querySelector("#apply").addEventListener("click", this._apply.bind(this));
        this._element.querySelector("#delete").addEventListener("click", this._delete.bind(this));
    }

    private _textItem: BaseTextItem;

    show(textItem: BaseTextItem) {
        this._textItem = textItem;

        this._element.classList.remove("hidden");

        this._textElement.value = textItem.text;
        this._colorElement.value = textItem.color.preview;
        this._sizeElement.value = textItem.font.size.toString();
        
        for (let i = 0; i < this._fontsElement.length; i++) {
            if (this._fontsElement.options[i].value === textItem.font.postScriptName)
                this._fontsElement.selectedIndex = i;
        }
    }

    hide() {
        this._element.classList.add("hidden");
        this._textItem = null;
    }

    private _apply() {
        if (this._textItem == null)
            return;

        this._helper.updateText(this._textItem.name, this._textElement.value);
        this._helper.updateFontColor(this._textItem.name, this._colorElement.value);

        const fontSize = parseFloat(this._sizeElement.value);
        if (fontSize !== this._textItem.font.size)
            this._helper.updateFontSize(this._textItem.name, fontSize);

        const postScriptName = this._fontsElement.selectedOptions[0].value;

        if (postScriptName !== this._textItem.font.postScriptName)
            this._helper.updateFontName(this._textItem.name, postScriptName);
    }

    private _delete() {
        const viewer: Viewer = (<any>window).designAtoms.viewer;

        viewer.canvas.deleteSelectedItemHandlers(true);
    }
}

class Logger {
    private _logElement: HTMLTextAreaElement;

    constructor(elementId: string) {
        this._logElement = <HTMLTextAreaElement>document.getElementById(elementId);
    }

    log(message: string) {
        this._logElement.value = `${new Date().toLocaleString()}: ${message} \n` + this._logElement.value;
    }
}