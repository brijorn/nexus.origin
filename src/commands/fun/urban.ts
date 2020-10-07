import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import moment from "moment-timezone";
import nodefetch from "node-fetch";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'urban'
		})
	}
	async run(message: Message, args: string[]): Promise<Message> {
		const word = args.length > 1 ? args.slice(0).join("+") : args[0];
		const wordDefinition = await getWord(word);
		if (!wordDefinition) return message.channel.send("Word Not Found");

		const definition = new MessageEmbed()
			.setTitle(`${wordDefinition.word} Definition`)
			.setURL(wordDefinition.permalink)
			.setDescription(wordDefinition.definition)
			.setThumbnail(
				"https://img.pngio.com/urbandictionarycom-userlogosorg-urban-dictionary-png-400_300.png"
			)
			.setFooter(
				`Definition by ${wordDefinition.author}, Written on: ${moment(
					wordDefinition.written_on
				).format("ddd, MMM Do YYYY at hh:mm a")}`
			);
		if (wordDefinition.example) {
			definition
				.addField("Example", wordDefinition.example)
				.addField("Likes", wordDefinition.thumbs_up, true)
				.addField("Dislikes", wordDefinition.thumbs_down, true);
		}
		return message.channel.send(definition);
	}
}
module.exports.help = {
	name: "urban",
};

async function getWord(word: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const definitions: any = await (await nodefetch(
		"http://api.urbandictionary.com/v0/define?term=" + word,
		{
			method: "GET",
		}
	)).json();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const definition = definitions.list.sort((a: Record<string, any>, b: Record<string, any>) => a.thumbs_up - b.thumbs_down);
	return definition[0];
}
