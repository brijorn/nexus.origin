"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verification_1 = require("../../../db/types/verification");
const config_json_1 = __importDefault(require("../../../config.json"));
const discord_js_1 = require("discord.js");
const prompt_1 = require("../../../prompt");
const embed_1 = __importDefault(require("../../embed"));
const role = require('../../../lib/parse/index').role;
module.exports = async (bot, message, args, guild) => {
    const verification = await new verification_1.VerificationSettings().get(message.guild.id);
    const mainGroup = verification.roleBinds.find(o => o.main === true);
    if (!args[1]) {
        const unverifiedStatus = (verification.unVerifiedEnabled === true) ? `${config_json_1.default.enabled} Enabled` : `${config_json_1.default.disabled} Disabled`;
        const dmVerificationStatus = (verification.dmVerification === true) ? `${config_json_1.default.enabled} Enabled` : `${config_json_1.default.disabled} Disabled`;
        const nicknameStatus = (verification.nicknaming === true) ? `${config_json_1.default.enabled} Enabled` : `${config_json_1.default.disabled} Disabled`;
        const autoVerifyStatus = (verification.autoVerify === true) ? `${config_json_1.default.enabled} Enabled` : `${config_json_1.default.disabled} Disabled`;
        console.log(verification.unVerifiedRole);
        const verifiedRoleStatus = (verification.verifiedRole === '' || verification.verifiedRole === null) ? 'None' : `${message.guild.roles.cache.get(verification.verifiedRole)}` + ' : ' + verification.verifiedRole;
        const unVerifiedRoleStatus = (verification.unVerifiedRole === '' || verification.unVerifiedRole === null) ? 'None' : `${message.guild.roles.cache.get(verification.unVerifiedRole)}` + ' : ' + verification.unVerifiedRole;
        const info = new discord_js_1.MessageEmbed()
            .setTitle('Verification Settings')
            .setDescription(`You can run the command ${guild.prefix}settings verification <setting> to change a setting.`)
            .addField('Group', `[${mainGroup.id}](https://www.roblox.com/groups/${mainGroup.id})`, true)
            .addField('VerifiedRole', verifiedRoleStatus, true)
            .addField('Bound Roles', mainGroup.binds.length, true)
            .addField('UnverifiedEnabled', unverifiedStatus, true)
            .addField('UnverifiedRole', unVerifiedRoleStatus, true)
            .addField('AutoVerify', autoVerifyStatus, true)
            .addField('Nicknaming', nicknameStatus, true)
            .addField('NicknameFormat', verification.nicknaming, true)
            .addField('dmVerification', dmVerificationStatus, true);
        const mainpage = await message.channel.send(info);
        return;
    }
    const arg1low = args[1].toLowerCase();
    if (arg1low === 'unverified' || arg1low === 'unverifiedenabled') {
        await enabledisable(bot, message, args, guild, verification, 'unVerifiedRole');
    }
    if (arg1low === 'unverifiedrole') {
        const unverified = require('../../../lib/role');
        await role(bot, message, args, guild, 'unverifiedRole', 'Unverified');
    }
    if (arg1low === 'nicknaming' || arg1low === 'nickname') {
        await enabledisable(bot, message, args, guild, verification, 'nicknaming');
    }
    if (arg1low === 'verified' || arg1low === 'verifiedrole') {
        const role = require('../../../lib/role');
        await role(bot, message, args, guild, 'verifiedRole', 'Verified');
    }
    if (arg1low === 'nicknameformat') {
        const nickformat = require('./nicknameFormat');
        await nickformat(bot, message, args, guild);
    }
    if (arg1low === 'autoverify') {
        await enabledisable(bot, message, args, guild, verification, 'autoVerify');
    }
    if (arg1low.includes('dm')) {
        await enabledisable(bot, message, args, guild, verification, 'dmVerification');
    }
};
async function enabledisable(bot, message, args, guild, verification, setting) {
    const requiredResponse = ['enable', 'disable', 'true', 'false'];
    let state = false;
    let value;
    if (args[2]) {
        const argument = args[2].toLowerCase();
        state = (requiredResponse.includes(argument)) ? true : false;
        value = (argument === 'true' || argument == 'false') ? true : false;
    }
    else {
        const startPrompt = await new prompt_1.editStart().init(message, embed_1.default(`${setting} Configuration`, `Would you like to \`enable\` or \`disable\` ${setting}?\n\nRespond **cancel** to cancel.`, guild, '', false, false));
        const argument = startPrompt.content.toLowerCase();
        if (startPrompt.content.toLowerCase() === 'cancel' || !startPrompt)
            return startPrompt.message.delete({ timeout: 5000 });
        state = (requiredResponse.includes(argument)) ? true : false;
        value = (argument === 'true' || argument == 'false') ? true : false;
    }
    if (state === false)
        return message.channel.send(embed_1.default('Error', `Invalid Response given, valid responses: ${requiredResponse.map(e => `${e}`).join(', ')}`, guild, 'failure', false, true));
    else {
        const enabled_disabled = (value === true) ? 'enabled' : 'disabled';
        message.channel.send(embed_1.default(`${setting} Configured`, `Successfully ${enabled_disabled} ${setting}`, guild, 'success', false, true));
        return await verification.update(message.guild.id, setting, value);
    }
}
