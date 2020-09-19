import { Client, Message } from "discord.js";
import GuildSettings from "../../db/guild/types";

const search = require("../../lib/urban");
const { MessageEmbed } = require("discord.js");
const moment = require("moment-timezone");
module.exports.run = async (
	bot: Client,
	message: Message,
	args: any[],
	guild: GuildSettings
) => {
	function compare(a: any, b: any) {
		let comp = 0;
		if (a.thumbs_up > b.thumbs_up) {
			return (comp = -1);
		} else {
			return (comp = 1);
		}
	}

	let def = await search(args[0]);
	def = def.list.sort(compare);
	def = def[0];

	if (!def) return message.channel.send("Word Not Found");

	const definition = new MessageEmbed()
		.setTitle(`${def.word} Definition`)
		.setURL(def.permalink)
		.setDescription(def.definition)
		.setThumbnail(
			"https://img.pngio.com/urbandictionarycom-userlogosorg-urban-dictionary-png-400_300.png"
		)
		.setFooter(
			`Definition by ${def.author}, Written on: ${moment(def.written_on).format(
				"ddd, MMM Do YYYY at hh:mm a"
			)}`
		);
	if (def.example) {
		definition
			.addField("Example", def.example)
			.addField("Likes", def.thumbs_up, true)
			.addField("Dislikes", def.thumbs_down, true);
	}
	message.channel.send(definition);
};

module.exports.help = {
	name: "urban",
};
