import { Message } from "discord.js";
import embed from "../../functions/embed";
import formats from "../../lib/util/json/formats.json";
import OriginMessage from "../../lib/extensions/OriginMessage";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";
import { GuildSettings } from "../../typings/origin";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: "nicknameformats",
			description: "View all the templates for nicknames",
		});
	}

	async run(
		message: OriginMessage,
		args: string[],
		guild: GuildSettings
	): Promise<Message> {
		const sort = formats.nicknameformats
			.map((each) => `${each.name} -> ${each.description}`)
			.join("\n\n");
		const note =
			"\nYou can also accompany these with regular text. Such as, `Hi, {discordname}#{discord-discrim}` or `[{rank}]{robloxname}`\n\n To configure your nickname format run `" +
			guild.prefix +
			"settings verification nicknameformat`";
		const send = embed(
			"Nickname Formats",
			`Available formats for verification nicknames.\n\`\`\`${sort}\`\`\`` +
				note,
			guild
		);
		return message.channel.send(send);
	}
}
