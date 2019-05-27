import { Product, Surface, PrintArea, SurfaceContainer, MockupContainer, SafetyLine, PdfBox } from "@aurigma/design-atoms/Model/Product";
import { RectangleF, PointF } from "@aurigma/design-atoms/Math";
import { RgbColor } from "@aurigma/design-atoms/Colors";
import { BaseTextItem, PlainTextItem, BoundedTextItem, ImageItem, TextAlignment } from "@aurigma/design-atoms/Model/Product/Items";
import { assignProperties } from "@aurigma/design-atoms/Utils/Utils";
import { Helper } from "../../scripts/Helper";

const backendUrl = "http://localhost:60669";
const holderElementId = "#viewer";

document.addEventListener("DOMContentLoaded", () => {
    const holderElement = document.querySelector(holderElementId) as HTMLDivElement;

    const viewer = Helper.initViewer(backendUrl, holderElement);
    const product = createProduct();
    viewer.surface = product.surfaces.get(0);

    const safetyLineEditor = new SafetyLineEditor();

    safetyLineEditor.safetyLine = product.surfaces.get(0).printAreas.get(0).safetyLines.get(0);

    (<any>window).designAtoms = {
        viewer: viewer,
        safetyLineEditor: safetyLineEditor
    };

    document.getElementById("hi-res")
        .addEventListener("click", () => Helper.render("/api/Render/pdf", new Product([viewer.surface]), "hires.pdf"));
});

function createProduct() {
    const surface = new Surface();
    const product = new Product([surface]);
    product.name = "Sample product";

    let mainContainer: SurfaceContainer;

    surface.width = 492;
    surface.height = 667;

    const printArea = new PrintArea(new RectangleF(36, 36, 420, 595));

    printArea.safetyLines.add(assignProperties(new SafetyLine(), {
            margin: { left: 5, top: 10, right: 15, bottom: 20 },
            pdfBox: PdfBox.Trim,
            altColor: new RgbColor("green")
        })
    );

    surface.printAreas.add(printArea);

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
            baselineLocation: new PointF(95, 322),
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
            textRectangle: new RectangleF(95, 372, 302, 197),
            text: "Many packaged web-to-print solutions on the market today work well enough, but they can also be rigid and prevent the customizability that many printers want. Customer's Canvas provides an opportunity for printers to get a solution that is better tailored to their internal workflows and give their customers a more unique and intuitive experience.",
            color: new RgbColor("#000000"),
            font: new BaseTextItem.FontSettings("Montserrat-Regular", 15),
            alignment: TextAlignment.Left,
            locked: false
        })
    );

    mainContainer.items.add(
        assignProperties(new ImageItem(), {
            sourceRectangle: new RectangleF(65, 96, 302, 175),
            source: new ImageItem.ImageSource(null, backendUrl + "/assets/image.jpg"),
            locked: false
        })
    );

    return product;
}


class SafetyLineEditor {
    private _marginEditorElement: HTMLElement;

    private _marginLeft: HTMLInputElement;
    private _marginRight: HTMLInputElement;
    private _marginTop: HTMLInputElement;
    private _marginBottom: HTMLInputElement;



    constructor() {
        this._marginEditorElement = document.getElementById("margin-editor");

        this._marginLeft = this._marginEditorElement.querySelector("#margin-left");
        this._marginRight = this._marginEditorElement.querySelector("#margin-right");
        this._marginTop = this._marginEditorElement.querySelector("#margin-top");
        this._marginBottom = this._marginEditorElement.querySelector("#margin-bottom");

        document.getElementById("apply").addEventListener("click", this.apply.bind(this));
    }
    
    apply() {
        const safetyLines = window.designAtoms.viewer.surface.printAreas.get(0).safetyLines;
        safetyLines.add(this.safetyLine);
        safetyLines.removeAt(0);
    }

    get safetyLine() {
        const  pdfBox = (<HTMLInputElement>document.querySelector('input[name="pdf-box"]:checked')).value;
        return assignProperties(new SafetyLine(),
            {
                margin: {
                    left: parseFloat(this._marginLeft.value),
                    top: parseFloat(this._marginTop.value),
                    right: parseFloat(this._marginRight.value),
                    bottom: parseFloat(this._marginBottom.value)
                },
                pdfBox: PdfBox[pdfBox],
                altColor: new RgbColor("green")
            }
        );
    }

    set safetyLine(value: SafetyLine) {
        this._marginLeft.value = (<any>value.margin).left;
        this._marginTop.value = (<any>value.margin).top;
        this._marginRight.value = (<any>value.margin).right;
        this._marginBottom.value = (<any>value.margin).bottom;

        const pdfBoxes = document.querySelectorAll('input[name="pdf-box"]');

        for (let i = 0; i < pdfBoxes.length; i++) {
            const pdfBox = <HTMLInputElement>pdfBoxes[i];

            pdfBox.checked = PdfBox[pdfBox.value] === value.pdfBox;
        }
    }
}