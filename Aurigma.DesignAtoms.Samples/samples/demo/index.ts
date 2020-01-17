import { Viewer } from "@aurigma/design-atoms/Viewer/Viewer";
import { Product, Surface, PrintArea, SafetyLine, SurfaceContainer, MockupContainer } from "@aurigma/design-atoms/Model/Product";
import { RectangleF, PointF } from "@aurigma/design-atoms/Math";
import { RgbColor } from "@aurigma/design-atoms/Colors";
import { assignProperties } from "@aurigma/design-atoms/Utils/Utils";
import { PlainTextItem, TextAlignment, BaseTextItem, BoundedTextItem, ImageItem } from "@aurigma/design-atoms/Model/Product/Items";
import { Helper, backendUrl } from "../../scripts";

function InitSurface(surface: Surface, backendUrl: string) {
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

    let mockupImg = assignProperties(new ImageItem(), {
        sourceRectangle: new RectangleF(0, 0, surface.width, surface.height),
        source: new ImageItem.ImageSource(null, backendUrl + "/assets/test-page-square.png")
    });

    let mockupContainer = new MockupContainer([mockupImg]);

    surface.mockup.overContainers.add(mockupContainer);

    let titleText: PlainTextItem;
    mainContainer.items.add(
        titleText = assignProperties(new PlainTextItem(), {
            name: "header",
            baselineLocation: new PointF(95.2, 321.5),
            text: "Just about any kind\nof print product",
            color: new RgbColor("#000000"),
            font: new BaseTextItem.FontSettings("Montserrat-Bold", 24),
            alignment: TextAlignment.Left,
            locked: false
        })
    );

    let mainText: BoundedTextItem;
    mainContainer.items.add(
        mainText = assignProperties(new BoundedTextItem(), {
            name: "body",
            textRectangle: new RectangleF(94.8, 372.15, 301.5, 197.1),
            text: "Many packaged web-to-print solutions on the market today work well enough, but they can also be rigid and prevent the customizability that many printers want. Customer's Canvas provides an opportunity for printers to get a solution that is better tailored to their internal workflows and give their customers a more unique and intuitive experience.",
            color: new RgbColor("#000000"),
            font: new BaseTextItem.FontSettings("Montserrat-Regular", 15),
            alignment: TextAlignment.Left,
            locked: false
        })
    );

    let image = assignProperties(new ImageItem(), {
        sourceRectangle: new RectangleF(58.8 + 36, 60 + 36, 301.9, 174.48),
        source: new ImageItem.ImageSource(null, backendUrl + "/assets/image.jpg"),
        locked: false
    });
    mainContainer.items.add(image);
}


const holderId = "#viewer";

document.addEventListener("DOMContentLoaded", () => {
    const holder = document.querySelector(holderId) as HTMLDivElement;
    (<any>window).designAtoms = {
        designAtomsBackendUrl: backendUrl,
    }

    var viewer = Helper.initViewer(backendUrl, holder);
    const product = new Product([new Surface()]);
    product.name = "Sample product";

    InitSurface(product.surfaces.get(0), backendUrl);

    viewer.surface = product.surfaces.get(0);

    window.designAtoms.viewer = viewer;

    var helper = new Helper((<any>window).designAtoms.viewer, (<any>window).designAtoms.designAtomsBackendUrl);
    (<any>window).designAtoms["helper"] = helper;

    const _viewer = (<any>window).designAtoms.viewer as Viewer;
    const textEditor = document.getElementById('text-editor');
    const allTextEditor = document.getElementById('all-text-editor');
    const mockupEditor = document.getElementById('mockup-editor');

    _viewer.canvas.add_selectedItemHandlerChanged((e) => {
        let selectedTypes = _viewer.selectedItems.map((item) => item.type);
        let selectedItem = _viewer.selectedItems[0] as BaseTextItem;
        if (_viewer.selectedItems.length === 1 && (selectedTypes.indexOf("PlainTextItem") >= 0 || selectedTypes.indexOf("BoundedTextItem") >= 0)) {
            textEditor.classList.remove('hidden');
            textEditor.querySelector('.text-editor__textarea')['value'] = selectedItem.text;
            textEditor.querySelector('.text-editor__color')['value'] = selectedItem.color.preview;
            textEditor.querySelector('.text-editor__size')['value'] = selectedItem.font.size;
            let val = selectedItem.font.postScriptName;
            Array.from(textEditor.querySelector('.text-editor__select')['options']).map((fontname: any, index) => {
                if (fontname.value == val) {
                    textEditor.querySelector('.text-editor__select')['selectedIndex'] = index;
                }
            })
        } else {
            textEditor.classList.add('hidden');
        }
    })

    textEditor.querySelector('.text-editor__button').addEventListener("click", () => approveChanges());

    function approveChanges() {
        const selectedItem = _viewer.selectedItems[0] as BaseTextItem;
        helper.updateText(selectedItem.name, textEditor.querySelector('.text-editor__textarea')['value']);
        helper.updateFontColor(selectedItem.name, textEditor.querySelector('.text-editor__color')['value']);
        helper.updateFontSize(selectedItem.name, textEditor.querySelector('.text-editor__size')['value']);
        helper.updateFontName(selectedItem.name, textEditor.querySelector('.text-editor__select')['selectedOptions'][0]['value']);
    }

    allTextEditor.querySelector('.all-text-editor__button').addEventListener("click", () => colorChange());

    function colorChange() {
        const allItems = Array.from(_viewer.surface.getAllItems({ ignoreMockups: true }) as any);
        allItems.map((item: any) => {
            helper.updateFontColor(item.name, allTextEditor.querySelector('.all-text-editor__color')['value']);
        })
    }
    mockupEditor.querySelector('.mockup-editor__button').addEventListener("click", () => mockupChange());

    function mockupChange() {
        helper.updateMockup(mockupEditor.querySelector('.mockup-editor__select')['selectedOptions'][0]['value']);
    }

});