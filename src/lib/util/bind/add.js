"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGroup = exports.addAsset = void 0;
const embed_1 = __importDefault(require("../../../functions/embed"));
const noblox_js_1 = __importDefault(require("noblox.js"));
const discord_js_1 = require("discord.js");
const parse_1 = __importDefault(require("../parse"));
async function addAsset(message, guild, verification, type, option, assetId, nickname, hierarchy, roles) {
    let product;
    if (verification[type] &&
        verification.assetBinds.find((a) => a.assetId === assetId))
        return message.channel.send(embed_1.default("none", "Binding already exists for this asset.", guild, "failure", false));
    try {
        product = await noblox_js_1.default.getProductInfo(assetId);
    }
    catch {
        return message.channel.send(embed_1.default("none", `${type} not found, make sure you gave a valid Roblox Asset`, guild, "failure", false));
    }
    const found = [];
    for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        const parser = await parse_1.default.role(message, role);
        if (parser.state === true) {
            found.push(parser.value);
        }
    }
    const assetObj = {
        assetId: assetId,
        nickname: nickname,
        hierarchy: hierarchy,
        roles: found,
    };
    // Save to Database
    const bindObject = verification[type];
    bindObject.push(assetObj);
    await verification.update(message.guild.id, type, bindObject);
    console.log('done');
    return message.channel.send(embed_1.default("none", `Successfully added the asset **${product.Name}(${assetId})** by ${product.Creator.Name} to the assetBinds list.`, guild, "success"));
}
exports.addAsset = addAsset;
async function addGroup(message, guild, verification, groupid, ranks, nickname, hierarchy, roles) {
    let group;
    nickname = nickname.replace("'", "");
    nickname = nickname.replace("'", "");
    try {
        group = await noblox_js_1.default.getGroup(groupid);
    }
    catch {
        return message.channel.send(embed_1.default("none", `Could not find the given group with an id of ${groupid}`, guild, "failure", false, false));
    }
    const foundroles = [];
    for (let b = 0; b < roles.length; b++) {
        const therole = roles[b];
        if (message.guild.roles.cache.find((r) => r.id === therole))
            foundroles.push(therole);
    }
    const groupranks = await noblox_js_1.default.getRoles(groupid);
    const foundranks = [];
    for (let i = 0; i < ranks.length; i++) {
        const rank = parseInt(ranks[i]);
        if (groupranks.find((a) => a.rank === rank)) {
            const found = groupranks.find((a) => a.rank === rank);
            foundranks.push(found);
        }
    }
    const newgroupObj = {
        id: group.id,
        main: false,
        binds: [],
    };
    if (!verification.roleBinds.find((o) => o.id === groupid))
        verification.roleBinds.push(newgroupObj);
    const groupobj = verification.roleBinds.find((o) => o.id === groupid);
    for (let i = 0; i < foundranks.length; i++) {
        const rank = foundranks[i];
        const rankObj = {
            id: rank.id,
            rank: rank.rank,
            nickname: nickname,
            roles: foundroles,
            hierarchy: hierarchy,
        };
        groupobj.binds.push(rankObj);
    }
    await verification.update(message.guild.id, "roleBinds", verification.roleBinds);
    if (foundranks.length < 6) {
        const endembed = new discord_js_1.MessageEmbed()
            .setTitle("Binding Finished")
            .setDescription("Successfully bound the following roles.");
        for (let i = 0; i < foundranks.length; i++) {
            const foundrank = foundranks[i];
            endembed.addField(foundrank.name, `**Id:** ${foundrank.id}\n**Rank:** ${foundrank.rank}\n**Roles:** ${foundroles
                .map((e) => `${e}`)
                .join(", ")}\n**Nickname:** ${nickname}\n**Hiearchy:** ${hierarchy}`, true);
        }
        return message.channel.send(endembed);
    }
    else {
        return message.channel.send(`Successfully bound the given ranks, to view your binds run the command \`${guild.prefix}binds view group [Optional: groupid]\``);
    }
}
exports.addGroup = addGroup;
