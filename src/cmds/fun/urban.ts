import { Client, Message } from "discord.js";
import { GuildSettings } from "typings/origin";
import { MessageEmbed } from "discord.js";
import moment from "moment-timezone";
import nodefetch from 'node-fetch'
export async function run(
	bot: Client,
	message: Message,
	args: any[],
	guild: GuildSettings
) {
	const word = (args.length > 1) ? args.slice(0).join('+') : args[0]
	const wordDefinition = await getWord(word)
	return console.log(wordDefinition)
	if (!wordDefinition) return message.channel.send("Word Not Found");

	const definition = new MessageEmbed()
		.setTitle(`${wordDefinition.word} Definition`)
		.setURL(wordDefinition.permalink)
		.setDescription(wordDefinition.definition)
		.setThumbnail(
			"https://img.pngio.com/urbandictionarycom-userlogosorg-urban-dictionary-png-400_300.png"
		)
		.setFooter(
			`Definition by ${wordDefinition.author}, Written on: ${moment(wordDefinition.written_on).format(
				"ddd, MMM Do YYYY at hh:mm a"
			)}`
		);
	if (wordDefinition.example) {
		definition
			.addField("Example", wordDefinition.example)
			.addField("Likes", wordDefinition.thumbs_up, true)
			.addField("Dislikes", wordDefinition.thumbs_down, true);
	}
	message.channel.send(definition);
};

module.exports.help = {
	name: "urban",
};

async function getWord(word: string) {
	const definitions: any[] = await nodefetch('http://api.urbandictionary.com/v0/define?term=' + word, {
		method: 'GET',
		body: 'application/json'
	}) as any
	const definition = definitions.sort((a, b) => a.thumbs_up - b.thumbs_down)
	return definition[0]
}