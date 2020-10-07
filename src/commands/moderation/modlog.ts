import OriginClient from '../../lib/OriginClient';
import Command from '../../lib/structures/Command';
import { Message, MessageEmbed, User } from 'discord.js';
import paginate from '../../lib/util/forEachPagination'
import formatDate from '../../lib/util/formatdate'
import {
	GuildSettings,
	ModerationLog,
	ModerationSettings,
	OriginMessage,
} from '../../typings/origin';
import { parseMember } from '../../lib/util/parse';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'modlogs',
			description: 'View all moderations for a user',
		});
	}

	async run(
		message: OriginMessage,
		args: string[],
		guild: GuildSettings,
	): Promise<void | Message> {
		if (!message.guild || !message.member) return;

		const moderation: ModerationSettings = await this.bot.handlers.database.getOne(
			'modules',
			'moderation',
			{ guild_id: message.guild.id },
		);
		if (!moderation)
			return message.error('Moderation is not setup for this guild');

		if (
			message.member.roles.cache.some((role) =>
				moderation.mod_roles.includes(role.id),
			) == false
		)
			return message.error('You do not have permission to run this command');

		const user = parseMember(message.guild, args.slice(0).join(' '));
		if (!user) return message.error('Please give a valid user');
		const userModerations: ModerationLog[] = await this.bot.handlers.database.get(
			'logs',
			'moderation',
			{ user_id: user.id },
		);
		if (!userModerations || userModerations.length < 1)
			return message.failure('This user has no moderations');

		const pages = parse(userModerations, user.user);
		if (pages.length == 1) return message.send(pages[0])
		else return await paginate(this.bot, message, pages, true)
	}
}

module.exports.help = {
	name: 'moderations',
};

function parse(log: ModerationLog[], user: User) {
	const embeds: MessageEmbed[] = [];
	let embedIteration = 0;
	let logPageAmount = 0;
	// Iterate through Each Log
	for (let i = 0; i < log.length; i++) {
		// New Page
		if (logPageAmount === 4) {
			embedIteration++;
			logPageAmount = 0;
		}

		if (logPageAmount == 0) {
			embeds[embedIteration] = new MessageEmbed()
			.setAuthor(`${user.username}'s Modlogs`, user.avatarURL() || '')
			embeds[embedIteration].description =
				'Use the arrows to move through pages.\n\n';
		}

		// Only 5 per Page
		const logData = log[i];
		embeds[embedIteration].description += convert(logData);
		logPageAmount++
	}
	return embeds;
}

function convert(data: ModerationLog) {
	return `${cap(data.type)} Case ${data.case_id}
	**Moderator:** ${data.mod_tag}(**ID:** ${data.mod_id})
	**Reason:** ${data.reason}
	**Date:** ${formatDate(data.date)} \n\n`;
}

function cap(t: string) {
	return t.charAt(0).toUpperCase() + t.slice(1);
}
