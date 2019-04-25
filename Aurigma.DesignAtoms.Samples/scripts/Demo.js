"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Items_1 = require("@aurigma/design-atoms/Model/Product/Items");
var Math_1 = require("@aurigma/design-atoms/Math");
var Color_1 = require("@aurigma/design-atoms/Color");
var Utils_1 = require("@aurigma/design-atoms/Utils/Utils");
var Product_1 = require("@aurigma/design-atoms/Model/Product");
var Demo = /** @class */ (function () {
    function Demo(_viewer, backendUrl) {
        this._viewer = _viewer;
        this.backendUrl = backendUrl;
    }
    Demo.prototype.updateText = function (name, text) {
        return __awaiter(this, void 0, void 0, function () {
            var textItem;
            return __generator(this, function (_a) {
                textItem = this._viewer.surface.containers.first().items.first(function (i) { return i.name === name; });
                textItem.text = text;
                return [2 /*return*/];
            });
        });
    };
    Demo.prototype.updateFontSize = function (name, size) {
        return __awaiter(this, void 0, void 0, function () {
            var textItem;
            return __generator(this, function (_a) {
                textItem = this._viewer.surface.containers.first().items.first(function (i) { return i.name === name; });
                textItem.font = new Items_1.BaseTextItem.FontSettings(textItem.font.postScriptName, size);
                return [2 /*return*/];
            });
        });
    };
    Demo.prototype.updateFontName = function (name, fontName) {
        return __awaiter(this, void 0, void 0, function () {
            var textItem;
            return __generator(this, function (_a) {
                textItem = this._viewer.surface.containers.first().items.first(function (i) { return i.name === name; });
                textItem.font = new Items_1.BaseTextItem.FontSettings(fontName, textItem.font.size);
                return [2 /*return*/];
            });
        });
    };
    Demo.prototype.updateFontColor = function (name, color) {
        return __awaiter(this, void 0, void 0, function () {
            var textItem;
            return __generator(this, function (_a) {
                textItem = this._viewer.surface.containers.first().items.first(function (i) { return i.name === name; });
                textItem.color = new Color_1.RgbColor(color);
                return [2 /*return*/];
            });
        });
    };
    Demo.prototype.updateMockup = function (mockup) {
        return __awaiter(this, void 0, void 0, function () {
            var mockupImg, mockupContainer;
            return __generator(this, function (_a) {
                mockupImg = Utils_1.assignProperties(new Items_1.ImageItem(), {
                    sourceRectangle: new Math_1.RectangleF(0, 0, this._viewer.surface.width, this._viewer.surface.height),
                    source: new Items_1.ImageItem.ImageSource(null, this.backendUrl + "/assets/" + mockup + ".png")
                });
                mockupContainer = new Product_1.MockupContainer([mockupImg]);
                this._viewer.surface.mockup.overContainers.removeAt(0);
                this._viewer.surface.mockup.overContainers.add(mockupContainer);
                return [2 /*return*/];
            });
        });
    };
    return Demo;
}());
exports.Demo = Demo;
