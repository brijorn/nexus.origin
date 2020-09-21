"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.default = async (userId, assetId) => {
    const res = await node_fetch_1.default(`http://api.roblox.com/Ownership/HasAsset?userId=${userId}&assetId=${assetId}`)
        .then(response => response.json());
    console.log(res);
    return res;
};
