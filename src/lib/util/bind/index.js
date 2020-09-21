"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.addGroup = exports.removeAsset = exports.addAsset = void 0;
const add_1 = require("./add");
Object.defineProperty(exports, "addAsset", { enumerable: true, get: function () { return add_1.addAsset; } });
Object.defineProperty(exports, "addGroup", { enumerable: true, get: function () { return add_1.addGroup; } });
const remove_1 = require("./remove");
Object.defineProperty(exports, "removeAsset", { enumerable: true, get: function () { return remove_1.removeAsset; } });
const list_1 = __importDefault(require("./list"));
exports.list = list_1.default;
exports.default = {
    addAsset: add_1.addAsset,
    removeAsset: remove_1.removeAsset,
    addGroup: add_1.addGroup,
    list: list_1.default,
};
