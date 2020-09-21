"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAsset = void 0;
const embed_1 = __importDefault(require("../../../functions/embed"));
async function removeAsset(message, guild, verification, option, id) {
    const setting = verification[option];
    let obj;
    obj = await setting.find((o) => o.assetId === id.toString());
    if (!obj)
        return message.channel.send(embed_1.default('none', `Could not find a ${option} binding with the Id of ${id}`, guild, 'failure', false));
    setting.splice(setting.indexOf(obj), 1);
    await verification.update(message.guild.id, option, setting);
    return message.channel.send(embed_1.default('none', `Successfully deleted ${id} from ${option} bindings.`, guild, 'success', false));
}
exports.removeAsset = removeAsset;
;
exports.removeGroup = async function (message, guild, verification, option, id) {
    const setting = verification[option];
    const obj = setting.find(a => a.id === id);
    if (!obj)
        return message.channel.send(embed_1.default('none', `Could not find a ${option} binding with the Id of ${id}`, guild, 'failure', false));
    setting.splice(setting.indexOf(obj), 1);
    await verification.update(message.guild.id, option, setting);
    return message.channel.send(embed_1.default('none', `Successfully deleted ${id} from ${option} bindings.`, guild, 'success', false));
};
