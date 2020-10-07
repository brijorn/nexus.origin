import { Message } from 'discord.js';
import embed from '../../functions/embed';
import time from '../../functions/time';
import { OriginMessage } from '../../lib/extensions/OriginMessage';
import OriginClient from '../../lib/OriginClient';
import Command from '../../lib/structures/Command';
import { GuildSettings } from '../../typings/origin';
export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'time',
			aliases: ['timezone'],
			description: 'See the time in different timezones or set your default time.'
		})
	}
	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void|Message> {
		const TheTime = await time(message, args[0]);
		if (!TheTime) return;
		message.channel.send(embed('🕒 Time', `The time in **${args[0]}** is ${TheTime}`, guild));
	}
}