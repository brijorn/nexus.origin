import { editStart } from '../../../lib/util/prompt'
import embed from '../../embed';
import formats from '../../../lib/util/json/formats.json';
import config from '../../../lib/util/json/config.json';
import { Client, Message, MessageEmbed } from 'discord.js';

import { VerificationSettings, GuildSettings } from '../../../typings/origin';
import OriginClient from '../../../lib/OriginClient';

module.exports = async (bot: OriginClient, verification: VerificationSettings, message: Message, args: string[], guild: GuildSettings) => {
	if (!args[2]) {
		const note = '\nYou can also accompany these with regular text. Such as, `Hi, {{discordname}}#{discordtag}}` or `[{{rank}}]{{robloxname}}`';
		const list = formats.nicknameformats.map(each => `${each.name} -> ${each.description}`).join('\n\n');
		const startmsg = new MessageEmbed()
			.setTitle('Nickname Formats')
			.setDescription(`What would you like to set the format to?\n**Available Formats:**\n\`\`\`${list}\`\`\`` + note + '\n\nRespond **cancel** to cancel.')
			.setFooter(guild.embed.footer, guild.embed.footerlogo);
		const start = await new editStart(message, startmsg).init();
		if (start!.content.toLowerCase() === 'cancel') {
			start!.message.delete({ timeout: 1 });
			return message.channel.send('Cancelled.');
		}
		const done = embed('Nickname Format', ` ${config.enabled}Your nickname format has successfully changed to \`${start!.content}\``, guild, config.success);
		start!.message.edit(done);
		await verification.update('nicknameFormat', start!.content)
	}

};