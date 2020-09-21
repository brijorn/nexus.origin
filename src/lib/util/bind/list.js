"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
async function menu(message, verification) {
    const menu = new discord_js_1.MessageEmbed()
        .setTitle('Server Bindings');
    for (let i = 0; i < verification.roleBinds.length; i++) {
        const group = verification.roleBinds[i];
        const name = (group.main === true) ? `📌${group.id}` : group.id;
        menu.addField(name, `Type: **Group**\nBindings: **${group.binds.length}**`, true);
    }
    for (let i = 0; i < verification.assetBinds.length && verification.assetBinds; i++) {
        const asset = verification.assetBinds[i];
        menu.addField(asset.assetId, `
        Type: **Asset**
        Nickname: **${asset.nickname}**
        Hierarchy: **${asset.hierarchy}**
        Roles: **${asset.roles.length}**`, true);
    }
    message.channel.send(menu);
}
exports.default = menu;
;
