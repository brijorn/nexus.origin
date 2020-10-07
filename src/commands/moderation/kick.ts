import { Message } from 'discord.js';
import OriginClient from '../../lib/OriginClient';
import Command from '../../lib/structures/Command';
import { parseMember } from '../../lib/util/parse';
import { dmUser, modChecks, sucessfulModeration } from '../../plugins/moderation/laws';
import {
	GuildSettings,
	ModerationSettings,
	OriginMessage,
} from '../../typings/origin';
import { MessageEmbed } from 'discord.js';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'kick',
			description: 'Kick a member from your discord server',
		});
	}
	async run(
		message: OriginMessage,
		args: string[],
		guild: GuildSettings,
	): Promise<void | Message> {
		if (!message.member || !message.guild) return;

		if (!args[0]) {
			const help = this.bot.commands.get('mute');
			const helpe = new MessageEmbed()
				.setTitle('Mute')
				.setDescription(help?.description)
				.addField('Syntax', help?.syntax.map((e) => `${e}`).join('\n'));
			return message.channel.send(helpe);
		}

		const moderation = await modChecks(this.bot, message)
		if (!moderation) return;

		const user = parseMember(message.guild, args[0]);
		if (!user) return message.failure('Please give a user to warn');
		if (user.kickable == false)
			return message.failure('I cannot kick this user');
		const reason = args.slice(1).join(' ') || 'None';

		await dmUser(user, 'kick', reason);

		return await sucessfulModeration({
			database: this.bot.handlers.database,
			jobs: this.bot.handlers.job,
			cache: this.bot.handlers.cache,
			message,
			guild,
			moderation,
			type: 'warn',
			user,
			moderator: message.member,
			reason: reason,
		});
	}
}
