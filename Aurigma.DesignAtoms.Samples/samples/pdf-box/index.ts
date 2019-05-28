import { RgbColor } from "@aurigma/design-atoms/Colors";
import { SafetyLine, PdfBox } from "@aurigma/design-atoms/Model/Product";
import { assignProperties } from "@aurigma/design-atoms/Utils/Utils";
import { Helper, ProductFactory } from "../../scripts";

const backendUrl = "http://localhost:60669";
const holderElementId = "#viewer";

document.addEventListener("DOMContentLoaded", () => {
    const holderElement = document.querySelector(holderElementId) as HTMLDivElement;

    const viewer = Helper.initViewer(backendUrl, holderElement);
    const product = ProductFactory.createProduct(backendUrl);
    viewer.surface = product.surfaces.get(0);

    const safetyLineEditor = new SafetyLineEditor();

    safetyLineEditor.safetyLine = product.surfaces.get(0).printAreas.get(0).safetyLines.get(0);

    (<any>window).designAtoms = {
        viewer: viewer,
        safetyLineEditor: safetyLineEditor
    };

    document.getElementById("hi-res")
        .addEventListener("click", async () => await Helper.render(viewer.surface, "hires.pdf"));
});

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