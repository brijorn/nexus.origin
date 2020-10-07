import { Message } from "discord.js";
import { OriginMessage } from "../../lib/extensions/OriginMessage";
import Command from "../../lib/structures/Command";

import { MessageEmbed } from 'discord.js';
import moment from 'moment-timezone';
import OriginClient from "../../lib/OriginClient";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'info',
			description: 'View info on the bot',
		})
	}

	async run(message: OriginMessage): Promise<Message> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let totalSeconds = (this.bot.uptime as any / 1000);
	const weeks = (totalSeconds > 604800000) ? Math.floor(totalSeconds / 604800000) : 0;
	totalSeconds %= 604800000;
	const days = Math.floor(totalSeconds / 86400);
	totalSeconds %= 86400;
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds % 60);

	const string = `${weeks} Weeks ${days} Days ${minutes} minutes and ${seconds} seconds`;

	const start = moment(this.bot.readyAt).tz('America/New_York').format('ddd, MMM Do YYYY hh:mm a');
	const info = new MessageEmbed()
		.setAuthor(this.bot.user?.username, this.bot.user?.avatarURL() as string)
		.addField('Version', '1.0.4', true)
		.addField('Library', 'discord.js', true)
		.addField('Creator', 'tranqin#0962', true)
		.addField('Users', this.bot.users.cache.size, true)
		.addField('Servers', this.bot.guilds.cache.size, true)
		.addField('Shard', this.bot.shard, true)
		.addField('Invite', '[here](https://discord.com/api/oauth2/authorize?client_id=737721159667286086&permissions=469821520&scope=bot)', true)
		.addField('Support', '[here](https://discord.gg/4Cn5xxp)', true)
		.addField('Top.gg', 'Coming Soon', true)
		.setFooter(`Last Started: ${start} | Uptime: ${string}`);
	return message.channel.send(info);
	}
}