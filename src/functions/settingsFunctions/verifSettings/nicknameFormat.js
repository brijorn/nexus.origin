const editStart = require('../../../prompt/editStartPrompt');
const editprompt = require('../../../prompt/editprompt');
const guild = require('../../../models/guildModel/guild');
const embed = require('../../embed');
const formats = require('../../../formats.json');
const config = require('../../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = async (bot, message, args, guild) => {
	if (!args[2]) {
		const note = '\nYou can also accompany these with regular text. Such as, `Hi, {{discordname}}#{discordtag}}` or `[{{rank}}]{{robloxname}}`';
		const list = formats.nicknameformats.map(each => `${each.name} -> ${each.description}`).join('\n\n');
		const startmsg = new MessageEmbed()
			.setTitle('Nickname Formats')
			.setDescription(`What would you like to set the format to?\n**Available Formats:**\n\`\`\`${list}\`\`\`` + note + '\n\nRespond **cancel** to cancel.')
			.setFooter(guild.embedInfo.footer, guild.embedInfo.footerlogo);
		const start = await editStart(message, startmsg);
		if (start.content.toLowerCase() === 'cancel') {
			start.message.delete({ timeout: 1 });
			return message.channel.send('Cancelled.');
		}
		const done = embed('Nickname Format', ` ${config.enabled}Your nickname format has successfully changed to \`${start.content}\``, guild, config.success);
		start.message.edit(done);
		guild.verificationSettings.nicknameFormat = start.content;
		guild.markModified('verificationSettings');
		await guild.save();
	}

};