import { Message } from "discord.js";
import Command from "../../lib/structures/Command";

import { MessageEmbed } from 'discord.js';
import { default as Axios } from 'axios';
import OriginClient from "../../lib/OriginClient";

export default class extends Command {

	constructor(bot: OriginClient) {
		super(bot, {
			name: 'weather',
			aliases: ['forecast'],
			description: 'See the weather in you\'re area. If your location is not a town or a city, start it with ~',
			syntax: ['!weather New York', '!weather ~Kilimanjaro'],
		})
	}

	async run(message: Message, args: string[]): Promise<Message> {
		if (!args[0]) {
			const help = this.bot.commands.get('weather');
			const helpe = new MessageEmbed()
				.setTitle('Weather')
				.setDescription(help?.description + `\n\n\`${help?.aliases.map((e: string) => `${e}`).join(', ')}\``)
				.addField('Syntax', help?.syntax);
			message.channel.send(helpe);
		}
		const input = (args.length > 1) ? args.slice(0).join('+') : args[0];
		// format=%c %l:%w:%t\n%f:%p\nChance: %o
		const data = await (await Axios.get('https://wttr.in/' + input + '?format=%c %l:%w:%t:%f:%p:%h:%S:%s')).data as string;
		const stringArray = data.split(':');
		const sunrise = stringArray.splice(6, 2).join(':');
		stringArray.splice(6, 1);
		const sunset = stringArray.splice(6, 2).join(':');
		stringArray.splice(6, 1);
		let title = data[0];
		title = title.replace('+', ' ');
		const weather = new MessageEmbed()
			.setTitle(title)
			.addField('Temperature', `${data[2]}\nFeels Like ${data[3]}`, true)
			.addField('Wind', data[1], true)
			.addField('Percipitation', data[4], true)
			.addField('Humidity', data[5], true)
			.addField('Sunrise', sunrise + ' am', true)
			.addField('Sunset', sunset + ' pm', true);
	
		return message.channel.send(weather);
	}
}

module.exports.help = {
	name: 'weather',
	aliases: ['forecast'],
	description: 'See the weather in you\'re area. If your location is not a town or a city, start it with ~',
	syntax: ['!weather New York', '!weather ~Kilimanjaro'],
};