import { parseMember } from '../../lib/util/parse';
import { Message } from 'discord.js';
import { OriginMessage } from '../../lib/extensions/OriginMessage';
import OriginClient from '../../lib/OriginClient';
import Command from '../../lib/structures/Command';
import { GuildSettings, ModerationSettings } from '../../typings/origin';
import { dmUser, sucessfulModeration } from '../../plugins/moderation/laws';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'warn',
			description: 'Warns the given member',
			syntax: ['!warn <nickname or username or userId or mention> <reason>'],
			cooldown: 3,
		});
	}

	async run(
		message: OriginMessage,
		args: string[],
		guild: GuildSettings,
	): Promise<Message | void> {
		if (!message.guild || !message.member)
			return message.error('Bot Error, try again.');
		if (!args[0]) {
			const help = this.bot.commands.get('warn');
			if (!help) return;
			return message.embed({
				title: help.name,
				description: help.description,
				fields: [
					{ name: 'Syntax', value: help.syntax.join('\n'), inline: true },
				],
			});
		}
		const moderation: ModerationSettings = await this.bot.handlers.database.getOne(
			'modules',
			'moderation',
			{ guild_id: message.guild.id },
		);

		if (!moderation)
			return message.error('Moderation is not setup for this guild');
		if (moderation.mod_enabled == false)
			return message.error('Moderation is not enabled for this guild');

		if (
			message.member.roles.cache.some((role) =>
				moderation.mod_roles.includes(role.id),
			) == false
		)
			return message.error('You do not have permission to run this command');

		const user = parseMember(message.guild, args[0]);
		if (!user) return message.failure('Please give a user to warn');

		const reason = args.slice(1).join(' ');
		if (!reason) return message.error('You must give a reason for warning');

		await dmUser(user, 'warn', reason);

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
