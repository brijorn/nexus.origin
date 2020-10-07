import { Client, Message } from 'discord.js';

// Require
import embed from '../functions/embed';
import OriginClient from '../lib/OriginClient';
import { OriginMessage } from '../lib/extensions/OriginMessage';
import Event from '../lib/structures/Event';
import { GuildSettings } from '../typings/origin';

// Economy

export default class extends Event {
	async execute(message: Message): Promise<void> {
		const start = Date.now();
		// Early Returns
		if (!message.guild) return;
		if (message.channel.type === 'dm') return;
		if (message.author.bot) return;
		const guild: GuildSettings = await this.bot.handlers.database.getOne(
			'public',
			'guild',
			{
				guild_id: message.guild.id,
			},
		);
		// Testing Prefix
		const prefix = '-';
		if (
			message.client.user &&
			message.content.includes(message.client.user.id)
		) {
			message.channel.send(
				embed('none', `My prefix here is \`${prefix}\`.`, guild),
			);
			return;
		}

		if (!message.content.startsWith(prefix)) return;

		// Message content array
		const messageArray = message.content.split(' ');
		// Remove command and lowerCase

		const cmd = messageArray[0].slice(prefix.length).toLowerCase();

		// Get the command file
		const cmdFile = this.bot.commands.fetch(cmd);
		if (!cmdFile) return;
		// Check if the command uses the command as an argument
		const args = messageArray.slice(1);
		if (cmdFile.includeCommand !== undefined && cmdFile.includeCommand === true)
			args.unshift(cmd);
		await cmdFile.run(message as OriginMessage, args, guild);

		// Time
		const end = Date.now();
		const finish = new Date(end - start);
		return console.log(
			finish.getSeconds() +
				' Seconds ' +
				finish.getMilliseconds() +
				' Milliseconds',
		);
	}
}
