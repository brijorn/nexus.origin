import embed from '../../functions/embed';
import Command from '../../lib/structures/Command';
import OriginClient from '../../lib/OriginClient';
import OriginMessage from '../../lib/extensions/OriginMessage';
import { GuildSettings } from '../../typings/origin';
import { Message } from 'discord.js';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'ranks',
			description: 'Show all the rank binds in the linked group in the guild and the ones available to you'
		})
	}
	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<Message> {
		const verification = await this.bot.handlers.verification.settings.fetch(message.guild?.id as string)
		if (!verification || verification.rank_binds.length < 0) return message.error('Error: This guild has no rank binds setup.');
		const user = await this.bot.handlers.verification.users.fetch(message.author.id)
		if (!user) return message.error('You must be verified to run this command.')
		return message.channel.send(embed('Searching', 'Searching for assets you own', guild));
	}
}