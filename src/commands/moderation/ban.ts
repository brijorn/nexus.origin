import { Message, MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import OriginClient from '../../lib/OriginClient';
import { GuildSettings, ModerationSettings, OriginMessage } from '../../typings/origin';
import { getModerationTime, modChecks, sucessfulModeration } from '../../plugins/moderation/laws';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'ban',
			description: 'Ban a user from your discord server.',
			cooldown: 3
		})
	}

	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void|Message> {
		if (!message.member || !message.guild) return;

		if (!args[0]) {
			const help = this.bot.commands.get('ban');
			const helpe = new MessageEmbed()
				.setTitle('Ban')
				.setDescription(help?.description)
				.addField('Syntax', help?.syntax.map(e => `${e}`).join('\n'));
			return message.channel.send(helpe);
		}

		

		const moderation = await modChecks(this.bot, message)
        if (!moderation) return;

		if (message.member.roles.cache.some(role => moderation.mod_roles.includes(role.id)) == false)
		return message.error('You do not have permission to run this command')

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

		await sucessfulModeration({
			database: this.bot.handlers.database,
			jobs: this.bot.handlers.job,
			cache: this.bot.handlers.cache,
			message,
			guild,
			moderation,
			type: 'ban',
			user,
			moderator: message.member,
			time: courtOrder.ms,
			readable: courtOrder.readable || 'indefinite',
			reason: courtOrder.reason || 'None',
		})
	}
}