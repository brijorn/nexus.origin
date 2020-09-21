"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_1 = require("../../../prompt");
const embed_1 = __importDefault(require("../../embed"));
const formats_json_1 = __importDefault(require("../../../json/formats.json"));
const config_json_1 = __importDefault(require("../../../config.json"));
const discord_js_1 = require("discord.js");
const verification_1 = require("../../../db/types/verification");
module.exports = async (bot, message, args, guild) => {
    const verification = await new verification_1.VerificationSettings().get(message.guild.id);
    if (!args[2]) {
        const note = '\nYou can also accompany these with regular text. Such as, `Hi, {{discordname}}#{discordtag}}` or `[{{rank}}]{{robloxname}}`';
        const list = formats_json_1.default.nicknameformats.map(each => `${each.name} -> ${each.description}`).join('\n\n');
        const startmsg = new discord_js_1.MessageEmbed()
            .setTitle('Nickname Formats')
            .setDescription(`What would you like to set the format to?\n**Available Formats:**\n\`\`\`${list}\`\`\`` + note + '\n\nRespond **cancel** to cancel.')
            .setFooter(guild.embed.footer, guild.embed.footerlogo);
        const start = await new prompt_1.editStart().init(message, startmsg);
        if (start.content.toLowerCase() === 'cancel') {
            start.message.delete({ timeout: 1 });
            return message.channel.send('Cancelled.');
        }
        const done = embed_1.default('Nickname Format', ` ${config_json_1.default.enabled}Your nickname format has successfully changed to \`${start.content}\``, guild, config_json_1.default.success);
        start.message.edit(done);
        await verification.update(message.guild.id, 'nicknameFormat', start.content);
    }
};
