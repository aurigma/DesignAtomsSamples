"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Viewer_1 = require("@aurigma/design-atoms/Viewer/Viewer");
var Product_1 = require("@aurigma/design-atoms/Model/Product");
var Math_1 = require("@aurigma/design-atoms/Math");
var Colors_1 = require("@aurigma/design-atoms/Colors");
var Utils_1 = require("@aurigma/design-atoms/Utils/Utils");
var Items_1 = require("@aurigma/design-atoms/Model/Product/Items");
var Helper_1 = require("../../scripts/Helper");
function InitViewer(backendUrl, holder) {
    var viewer = new Viewer_1.Viewer({
        holderElement: holder,
        backendUrl: backendUrl,
        canvasBackground: { color: "white" }
    });
    viewer.clearSelectionOnDocumentClick = false;
    viewer.rulerScale = 0.0138888889; // inches
    initCanvas(viewer.canvas);
    var product = new Product_1.Product([new Product_1.Surface()]);
    product.name = "Sample product";
    InitSurface(product.surfaces.get(0), backendUrl);
    viewer.surface = product.surfaces.get(0);
    window.designAtoms.viewer = viewer;
}
exports.InitViewer = InitViewer;
function InitSurface(surface, backendUrl) {
    var printArea;
    var mainContainer;
    surface.width = 491.5;
    surface.height = 667.2;
    surface.printAreas.add(printArea = new Product_1.PrintArea(new Math_1.RectangleF(36, 36, 419.5, 595.2)));
    surface.containers.setRange([
        mainContainer = Utils_1.assignProperties(new Product_1.SurfaceContainer(), { name: "main" })
    ]);
    var mockupImg = Utils_1.assignProperties(new Items_1.ImageItem(), {
        sourceRectangle: new Math_1.RectangleF(0, 0, surface.width, surface.height),
        source: new Items_1.ImageItem.ImageSource(null, backendUrl + "/assets/test-page-square.png")
    });
    var mockupContainer = new Product_1.MockupContainer([mockupImg]);
    surface.mockup.overContainers.add(mockupContainer);
    var titleText;
    mainContainer.items.add(titleText = Utils_1.assignProperties(new Items_1.PlainTextItem(), {
        name: "header",
        baselineLocation: new Math_1.PointF(95.2, 321.5),
        text: "Just about any kind\n\rof print product",
        color: new Colors_1.RgbColor("#000000"),
        font: new Items_1.BaseTextItem.FontSettings("Montserrat-Bold", 24),
        alignment: Items_1.TextAlignment.Left,
        locked: false
    }));
    var mainText;
    mainContainer.items.add(mainText = Utils_1.assignProperties(new Items_1.BoundedTextItem(), {
        name: "body",
        textRectangle: new Math_1.RectangleF(94.8, 372.15, 301.5, 197.1),
        text: "<p><span>Many packaged web-to-print solutions on the market today work well enough, but they can also be rigid and prevent the customizability that many printers want. Customer�s Canvas provides an opportunity for printers to get a solution that is better tailored to their internal workflows and give their customers a more unique and intuitive experience.</span></p>",
        color: new Colors_1.RgbColor("#000000"),
        font: new Items_1.BaseTextItem.FontSettings("Montserrat-Regular", 15),
        alignment: Items_1.TextAlignment.Left,
        locked: false
    }));
    var image = Utils_1.assignProperties(new Items_1.ImageItem(), {
        sourceRectangle: new Math_1.RectangleF(58.8 + 36, 60 + 36, 301.9, 174.48),
        source: new Items_1.ImageItem.ImageSource(null, backendUrl + "/assets/image.jpg"),
        locked: false
    });
    mainContainer.items.add(image);
}
function initCanvas(canvas) {
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
var backendUrl = "http://localhost:60669";
var holderId = "#viewer";
document.addEventListener("DOMContentLoaded", function () {
    var holder = document.querySelector(holderId);
    window.designAtoms = {
        designAtomsBackendUrl: backendUrl,
    };
    InitViewer(backendUrl, holder);
    var helper = new Helper_1.Helper(window.designAtoms.viewer, window.designAtoms.designAtomsBackendUrl);
    window.designAtoms["helper"] = helper;
    var _viewer = window.designAtoms.viewer;
    var textEditor = document.getElementById('text-editor');
    var allTextEditor = document.getElementById('all-text-editor');
    var mockupEditor = document.getElementById('mockup-editor');
    _viewer.canvas.add_selectedItemHandlerChanged(function (e) {
        var selectedTypes = _viewer.selectedItems.map(function (item) { return item.type; });
        var selectedItem = _viewer.selectedItems[0];
        console.log(_viewer.selectedItems.length);
        if (_viewer.selectedItems.length === 1 && (selectedTypes.indexOf("PlainTextItem") >= 0 || selectedTypes.indexOf("BoundedTextItem") >= 0)) {
            textEditor.classList.remove('hidden');
            textEditor.querySelector('.text-editor__textarea')['value'] = selectedItem.text;
            textEditor.querySelector('.text-editor__color')['value'] = selectedItem.color.preview;
            textEditor.querySelector('.text-editor__size')['value'] = selectedItem.font.size;
            var val_1 = selectedItem.font.postScriptName;
            Array.from(textEditor.querySelector('.text-editor__select')['options']).map(function (fontname, index) {
                if (fontname.value == val_1) {
                    textEditor.querySelector('.text-editor__select')['selectedIndex'] = index;
                }
            });
        }
        else {
            textEditor.classList.add('hidden');
        }
    });
    textEditor.querySelector('.text-editor__button').addEventListener("click", function () { return approveChanges(); });
    function approveChanges() {
        var selectedItem = _viewer.selectedItems[0];
        helper.updateText(selectedItem.name, textEditor.querySelector('.text-editor__textarea')['value']);
        helper.updateFontColor(selectedItem.name, textEditor.querySelector('.text-editor__color')['value']);
        helper.updateFontSize(selectedItem.name, textEditor.querySelector('.text-editor__size')['value']);
        helper.updateFontName(selectedItem.name, textEditor.querySelector('.text-editor__select')['selectedOptions'][0]['value']);
    }
    allTextEditor.querySelector('.all-text-editor__button').addEventListener("click", function () { return colorChange(); });
    function colorChange() {
        var allItems = Array.from(_viewer.surface.getAllItems({ ignoreMockups: true }));
        allItems.map(function (item) {
            helper.updateFontColor(item.name, allTextEditor.querySelector('.all-text-editor__color')['value']);
        });
    }
    mockupEditor.querySelector('.mockup-editor__button').addEventListener("click", function () { return mockupChange(); });
    function mockupChange() {
        helper.updateMockup(mockupEditor.querySelector('.mockup-editor__select')['selectedOptions'][0]['value']);
    }
});
