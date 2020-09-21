import embed from "../../functions/embed";
import { Client, Message, MessageEmbed, TextChannel } from "discord.js";

import GuildSettings from "../../db/guild/guild";
import { SuggestionSettings } from "../../db/types/suggestion";

export async function run(
	bot: Client,
	message: Message,
	args: string[],
	guild: GuildSettings
) {
	const settings = await new SuggestionSettings().get(message.guild!.id);
	if (!settings || settings.enabled === false)
		return message.reply(
			embed(
				"none",
				"Suggestions are not enabled for this guild.",
				guild,
				"failure",
				false,
				true
			)
		);
	const amount = parseInt(settings.amount) + 1;

	const content = args.slice(0).join(" ");
	if (content.length <= 5)
		return message.reply(
			embed(
				"none",
				"Suggestions must be more than 5 words long.",
				guild,
				"failure",
				true,
				true
			)
		);
	const channel = message.client.channels.cache.get(
		settings.channel
	) as TextChannel;
	const suggestion = new MessageEmbed()
		.setTitle(`Suggestion #${settings}`)
		.setAuthor(
			`${message.author.username}#${message.author.discriminator}`,
			message.author.avatarURL()!
		)
		.setDescription(content)
		.setFooter("Nexus Origin")
		.setTimestamp();
	const msg = await channel.send(suggestion);
	try {
		await msg.react(settings.firstReaction);
		await msg.react(settings.secondReaction);
	} catch {}
	await settings.increment(amount, {
		log: true,
		channelId: channel.id,
		messageId: msg.id,
	});
	return;
}

module.exports.help = {
	name: "suggest",
	module: "user",
	description: "Send a suggestion to the guild suggestions chanenl",
	aliases: ["suggestion"],
	syntax: ["!suggest [suggestion]", "!suggest approve [message-id] "],
	inDepth:
		"Send a suggestion to the guild suggestions chanenl, requires suggestions to be enabled with a channel",
};
