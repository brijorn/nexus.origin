import { Message, MessageEmbed } from "discord.js";
import nodefetch from 'node-fetch'
import OriginClient from "../../lib/OriginClient";
import Command from '../../lib/structures/Command'
import { OriginMessage } from "../../lib/extensions/OriginMessage";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'define',
			aliases!: ['def'],
			description!: 'Gives you the dictionary definition of a word.',
			syntax!: ['!define <word>'],
		})
	}
	
	async run(message: OriginMessage, args: string[]): Promise<Message|undefined> {
		async function getDefinition(word: string) {
			const word_information = await nodefetch('https://owlbot.info/api/v4/dictionary/' + word, {
				headers: {
					Authorization: 'TOKEN  acdc6da274dc224f9fa9645d86fbc4e7146e0a96'
				}
			})
			.then(res => res.json())
			return word_information;
		}
	
		if (!args[0]) return message.channel.send('Please give a word to get the definition for');
		const word = (args.length > 1) ? args.splice(0).join('+') : args[0];
		const info = await getDefinition(word);
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
		return message.channel.send(definition);
	
	}
	}