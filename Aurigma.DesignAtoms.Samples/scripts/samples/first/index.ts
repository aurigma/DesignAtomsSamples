import { InitViewer } from "../../InitViewer";
import { Demo } from "../../Demo";
import { Viewer } from "@aurigma/design-atoms/Viewer/Viewer";
import { Product, Surface, PrintArea, SafetyLine, SurfaceContainer, MockupContainer } from "@aurigma/design-atoms/Model/Product";
import { RectangleF, PointF } from "@aurigma/design-atoms/Math";
import { RgbColor } from "@aurigma/design-atoms/Color";
import { assignProperties } from "@aurigma/design-atoms/Utils/Utils";
import { PlainTextItem, TextAlignment, BaseTextItem, TextVerticalAlignment, BoundedTextItem, ImageItem } from "@aurigma/design-atoms/Model/Product/Items";
import { Canvas } from "@aurigma/design-atoms/Canvas";

const backendUrl = "http://localhost:60669";
const holderId = "#viewer";



window.onload = () => {
    const holder = document.querySelector(holderId) as HTMLDivElement;
    (<any>window).designAtoms = {
        designAtomsBackendUrl: "http://localhost:60669",
    }
    InitViewer(backendUrl, holder);

    var demo = new Demo((<any>window).designAtoms.viewer, (<any>window).designAtoms.designAtomsBackendUrl);
    (<any>window).designAtoms["demo"] = demo;

    const _viewer = (<any>window).designAtoms.viewer as Viewer;
    const textEditor = document.getElementById('text-editor');
    const allTextEditor = document.getElementById('all-text-editor');
    const mockupEditor = document.getElementById('mockup-editor');

    _viewer.canvas.add_selectedItemHandlerChanged((e) => {
        let selectedTypes = _viewer.selectedItems.map((item) => item.type);
        let selectedItem = _viewer.selectedItems[0] as BaseTextItem;
        console.log(_viewer.selectedItems.length);
        if (_viewer.selectedItems.length === 1 && (selectedTypes.indexOf("PlainTextItem") >= 0 || selectedTypes.indexOf("BoundedTextItem") >= 0)) {
            textEditor.classList.remove('hidden');
            textEditor.querySelector('.text-editor__textarea')['value'] = selectedItem.text;
            textEditor.querySelector('.text-editor__color')['value'] = selectedItem.color.Preview;
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
        demo.updateText(selectedItem.name, textEditor.querySelector('.text-editor__textarea')['value']);
        demo.updateFontColor(selectedItem.name, textEditor.querySelector('.text-editor__color')['value']);
        demo.updateFontSize(selectedItem.name, textEditor.querySelector('.text-editor__size')['value']);
        demo.updateFontName(selectedItem.name, textEditor.querySelector('.text-editor__select')['selectedOptions'][0]['value']);
    }

    allTextEditor.querySelector('.all-text-editor__button').addEventListener("click", () => colorChange());

    function colorChange() {
        const allItems = Array.from(_viewer.surface.getAllItems({ ignoreMockups: true }) as any);
        allItems.map((item: any) => {
            demo.updateFontColor(item.name, allTextEditor.querySelector('.all-text-editor__color')['value']);
        })
    }
    mockupEditor.querySelector('.mockup-editor__button').addEventListener("click", () => mockupChange());

    function mockupChange() {
        demo.updateMockup(mockupEditor.querySelector('.mockup-editor__select')['selectedOptions'][0]['value']);
    }

};