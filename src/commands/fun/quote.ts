import { Message } from "discord.js";

import { MessageEmbed } from "discord.js";
import nodefetch from "node-fetch";
import Command from "../../lib/structures/Command";
import OriginClient from "../../lib/OriginClient";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'quote',
			aliases!: ['def'],
			description!: 'Gives you an inspiraitonal quote',
			syntax!: ['!quote']
		})
	}
	async run(message: Message): Promise<Message> {
		const data = (await nodefetch(
			"https://type.fit/api/quotes"
		)) as unknown as Quote[];

		const quote = data[Math.round(Math.random() * data.length) - 1];

		const built = new MessageEmbed()
			.setDescription(quote.text)
			.setFooter(quote.author);
		return message.channel.send(built);
	}
}

interface Quote {
	text: string,
	author: string
}
