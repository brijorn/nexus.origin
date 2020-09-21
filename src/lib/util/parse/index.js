"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = exports.role = exports.time = exports.member = void 0;
const member_1 = __importDefault(require("./member"));
exports.member = member_1.default;
const time_1 = __importDefault(require("./time"));
exports.time = time_1.default;
const role_1 = __importDefault(require("./role"));
exports.role = role_1.default;
const channel_1 = __importDefault(require("./channel"));
exports.channel = channel_1.default;
exports.default = {
    member: member_1.default,
    time: time_1.default,
    role: role_1.default,
    channel: channel_1.default
};
