import { Message, MessageEmbed } from 'discord.js';
import OriginClient from '../../lib/OriginClient';
import Command from '../../lib/structures/Command';
import { getModerationTime, modChecks, sucessfulModeration } from '../../plugins/moderation/laws';
import { GuildSettings, ModerationSettings, OriginMessage } from '../../typings/origin';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'mute',
			description: 'Mute a member in your guild'
		})
	}

	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void|Message> {
		if (!message.member || !message.guild) return;

		if (!args[0]) {
			const help = this.bot.commands.get('mute');
			const helpe = new MessageEmbed()
				.setTitle('Mute')
				.setDescription(help?.description)
				.addField('Syntax', help?.syntax.map(e => `${e}`).join('\n'));
			return message.channel.send(helpe);
		}

		const moderation = await modChecks(this.bot, message)
		if (!moderation) return;

		const courtOrder = getModerationTime(args)
		if (courtOrder.error || !courtOrder.userId) {
			if (courtOrder.error == 'null') return message.error(
				`Missing arguments, run ${guild.prefix}help ban for more info.`
			)

			if (courtOrder.error == 'missing user') return message.error(
				`Please mention or give the userId of the member to ban`
			)

			else return message.error('Missing required field.')
		}

		const user = message.guild.members.cache.get(courtOrder.userId)
		if (user == undefined) return message.error('User Not Found.')
		
		await user.roles.add(moderation.muted_role)
		.catch(() => { return message.error('Failed to give muted role, make sure it exists')})
		await sucessfulModeration({
			database: this.bot.handlers.database,
			jobs: this.bot.handlers.job,
			cache: this.bot.handlers.cache,
			message,
			guild,
			moderation,
			type: 'mute',
			user,
			moderator: message.member,
			time: courtOrder.ms,
			readable: courtOrder.readable || 'Permanent',
			reason: courtOrder.reason || 'None',
		})
	}
}