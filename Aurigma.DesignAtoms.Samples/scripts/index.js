"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InitViewer_1 = require("./InitViewer");
var Demo_1 = require("./Demo");
var backendUrl = "http://localhost:60669";
var holderId = "#viewer";
window.onload = function () {
    var holder = document.querySelector(holderId);
    window.designAtoms = {
        designAtomsBackendUrl: "http://localhost:60669",
    };
    InitViewer_1.InitViewer(backendUrl, holder);
    var demo = new Demo_1.Demo(window.designAtoms.viewer, window.designAtoms.designAtomsBackendUrl);
    window.designAtoms["demo"] = demo;
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
            textEditor.querySelector('.text-editor__color')['value'] = selectedItem.color.Preview;
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
        demo.updateText(selectedItem.name, textEditor.querySelector('.text-editor__textarea')['value']);
        demo.updateFontColor(selectedItem.name, textEditor.querySelector('.text-editor__color')['value']);
        demo.updateFontSize(selectedItem.name, textEditor.querySelector('.text-editor__size')['value']);
        demo.updateFontName(selectedItem.name, textEditor.querySelector('.text-editor__select')['selectedOptions'][0]['value']);
    }
    allTextEditor.querySelector('.all-text-editor__button').addEventListener("click", function () { return colorChange(); });
    function colorChange() {
        var allItems = Array.from(_viewer.surface.getAllItems({ ignoreMockups: true }));
        allItems.map(function (item) {
            demo.updateFontColor(item.name, allTextEditor.querySelector('.all-text-editor__color')['value']);
        });
    }
    mockupEditor.querySelector('.mockup-editor__button').addEventListener("click", function () { return mockupChange(); });
    function mockupChange() {
        demo.updateMockup(mockupEditor.querySelector('.mockup-editor__select')['selectedOptions'][0]['value']);
    }
};
