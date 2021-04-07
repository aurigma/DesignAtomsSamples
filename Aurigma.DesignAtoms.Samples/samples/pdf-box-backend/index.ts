import { JsonProductSerializer } from "@aurigma/design-atoms-model/Product/Serializer/JsonProductSerializer";
import { Product, PdfBox } from "@aurigma/design-atoms-model/Product";
import { assignProperties } from "@aurigma/design-atoms-model/Utils/Utils";
import { Helper, backendUrl } from "../../scripts";

const holderElementId = "#viewer";

document.addEventListener("DOMContentLoaded", async () => {
    const holderElement = document.querySelector(holderElementId) as HTMLDivElement;

    const viewer = Helper.initViewer(backendUrl, holderElement);
    const product = await Helper.loadProduct("../../api/Generate");

    viewer.surface = product.surfaces.get(0);
    
    const safetyLineEditor = new SafetyLineEditor();

    safetyLineEditor.safetyLineData = new SafetyLineData();

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
    
    async apply() {
        const viewer = window.designAtoms.viewer;

        const serializer = new JsonProductSerializer();

        const serializedProduct = serializer.serialize(new Product([viewer.surface]));

        const serializedSafetyLineData = JSON.stringify(this.safetyLineData);

        const response = await fetch('../../api/safetyLines',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: `{ product: ${serializedProduct}, safetyLineData: ${serializedSafetyLineData} }`
            });

        const data = await response.json();

        const product = serializer.deserialize(data);

        viewer.surface = product.surfaces.get(0);
    }

    get safetyLineData() {
        const  pdfBox = (<HTMLInputElement>document.querySelector('input[name="pdf-box"]:checked')).value;
        return assignProperties(new SafetyLineData(),
            {
                marginLeft: parseFloat(this._marginLeft.value),
                marginTop: parseFloat(this._marginTop.value),
                marginRight: parseFloat(this._marginRight.value),
                marginBottom: parseFloat(this._marginBottom.value),
                pdfBox: PdfBox[pdfBox]
            }
        );
    }

    set safetyLineData(value: SafetyLineData) {
        this._marginLeft.value = value.marginLeft.toString();
        this._marginTop.value = value.marginTop.toString();
        this._marginRight.value = value.marginRight.toString();
        this._marginBottom.value = value.marginBottom.toString();

        const pdfBoxes = document.querySelectorAll('input[name="pdf-box"]');

        for (let i = 0; i < pdfBoxes.length; i++) {
            const pdfBox = <HTMLInputElement>pdfBoxes[i];

            pdfBox.checked = PdfBox[pdfBox.value] === value.pdfBox;
        }
    }
}

class SafetyLineData {
    marginLeft: number = 0;
    marginTop: number = 0;
    marginRight: number = 0;
    marginBottom: number = 0;

    pdfBox: PdfBox = PdfBox.Crop;
}