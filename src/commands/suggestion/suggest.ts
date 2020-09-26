import embed from "../../functions/embed";
import { Client, Message, MessageEmbed, TextChannel } from "discord.js";

import { SuggestionSettings, GuildSettings } from "../../typings/origin";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";
import OriginMessage from "../../lib/extensions/OriginMessage";
import { message } from "noblox.js";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'suggest',
			description: 'Suggest something to this guild',
			syntax: ['!suggest <suggestion>']
		})
	}
	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<Message|void> {
		const settings: SuggestionSettings = await this.bot.handlers.database.getOne('modules', 'suggestion', { guild_id: message.guild?.id})
	if (!settings || settings.enabled === false)
		return message.error("Suggestions are not enabled for this guild.")
	const suggestionCount = parseInt(settings.suggestion_count) + 1;

	const content = args.slice(0).join(" ");
	if (content.split(' ').length < 3)
		return message.reply(
			embed(
				"none",
				"Suggestions must be more than 3 words long.",
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
			message.author.avatarURL() as string
		)
		.setDescription(content)
		.setFooter("Nexus Origin")
		.setTimestamp();
	const msg = await channel.send(suggestion);
	try {
		await msg.react(settings.first_reaction);
		await msg.react(settings.second_reaction);
	} catch { return; }
	await this.bot.handlers.database.updateOne(
		'modules',
		'suggestion',
		{ guild_id: message.guild?.id},
		{ suggestion_count: suggestionCount}
	)
	return;
	}
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
