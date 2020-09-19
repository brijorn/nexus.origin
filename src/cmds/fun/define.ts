import { Client, Message, MessageEmbed } from "discord.js";
import GuildSettings from "../../db/guild/types";
import nodefetch from 'node-fetch'
const Axios = require('axios').default;

export async function run(bot: Client, message: Message, args: any[], guild: GuildSettings) {
	async function getDefinition(word: string) {
		const word_information = await nodefetch('https://owlbot.info/api/v4/dictionary/' + word, {
			headers: {
				Authorization: 'TOKEN  acdc6da274dc224f9fa9645d86fbc4e7146e0a96'
			}
		})
		.then(res => res.json())
		.catch(() => { return message.channel.send('Word not Found.')})
		return word_information as any;
	}

	if (!args[0]) return message.channel.send('Please give a word to get the definition for');
	const word = (args.length > 1) ? args.splice(0).join('+') : args[0];
	let info = await getDefinition(word);
	if (!info) return;

	let title = info.word;

	if (info.pronunciation !== null) title += ` [${info.pronunciation}]`;
	const definition = new MessageEmbed()
		.setTitle(title)
		.setColor('#ffffff');

	let desc = '';

	for (let i = 0; i < info.definitions.length; i++) {
		const def = info.definitions[i];
		desc += `\`${i + 1}\`. \`${def.type}\` ${def.definition}`;
		if (def.example) desc += `\nExample: ${def.example}\n\n`;
		else desc += '\n\n'
		if (def.image_url) definition.setThumbnail(def.image_url);
		if (def.emoji) definition.addField('Emoji', def.emoji);

	}
	definition.setDescription(desc);
	message.channel.send(definition);

};

module.exports.help = {
	name: 'define',
};