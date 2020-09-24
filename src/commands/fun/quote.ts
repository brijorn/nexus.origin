import { Client, Message } from "discord.js";
import { GuildSettings } from "../../typings/origin";

const { MessageEmbed } = require("discord.js");
import nodefetch from "node-fetch";

export async function run(
	bot: Client,
	message: Message,
	args: any,
	guild: GuildSettings
) {
	const data: object[] = (await nodefetch(
		"https://type.fit/api/quotes"
	)) as any;

	const quote: object = data[Math.round(Math.random() * data.length) - 1];

	build(message, quote);
}
function build(message: Message, quote: any | object) {
	const built = new MessageEmbed()
		.setDescription(quote.text)
		.setFooter(quote.author);
	message.channel.send(built);
}

module.exports.help = {
	name: "quote",
	module: "fun",
	syntax: ["!quote"],
	description: "Get a random quote",
	cooldown: 3,
};
