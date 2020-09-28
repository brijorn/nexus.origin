import embed from "../../functions/embed";
import noblox, { getOwnership, setRank } from "noblox.js";
import OriginMessage from "../../lib/extensions/OriginMessage";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";
import { GuildSettings } from "../../typings/origin";
import { Message } from "discord.js";
import { editStart } from "../../lib/util/prompt";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: "getrank",
			description:
				"Gives you the rank in the linked group if you own the specified asset.",
		});
	}

	async run(
		message: OriginMessage,
		args: string[],
		guild: GuildSettings
	): Promise<Message> {
		if (!message.guild) return message.error("Bot Error");
		try {
			noblox.setCookie(
				await this.bot.handlers.database.decryptToken(message.guild.id)
			);
		} catch {
			return message.error(
				"Invalid .ROBLOSECURITY for guild. Set one with the !token command."
			);
		}
		const verification = await this.bot.handlers.verification.settings.fetch(
			message.guild.id
		);
		const user = await this.bot.handlers.verification.users.fetch(
			message.author.id
		);
		if (!user)
			return message.error("You must be verified to run this command.");
		if (!verification)
			return message.error(
				"There are no verification settings for this guild."
			);
		if (!verification.rank_binds || verification.rank_binds.length < 1) {
			return message.error("There are no rank bindings for this guild.");
		}
		const mainGroup = verification.role_binds.find(
			(group) => group.main == true
		);
		if (!mainGroup)
			return message.error(
				"There is no main verification group set for this guild."
			);
		if (!args.length) {
			const prompt = await editStart(message, {
				title: "Ranking",
				description: `What is the rank you wish to receive?\nPlease use proper **spelling**
					\nTo see all available ranks run the \`${guild.prefix}ranks\` command.
					\nSay **cancel** to cancel`,
			});
			if (!prompt || prompt.content.toLowerCase() == "cancel")
				return message.error("Cancelled");
			const rank = verification.rank_binds.find(
				(rank) => rank.name == prompt.content
			);
			if (!rank) return message.error(`Cannot find rank ${prompt.content}`);
			const ownsAsset = await getOwnership(user.primary_account, rank.assetId);
			if (ownsAsset == false)
				return message.error("You do not own the given asset.");
			const rankUser = await setRank(
				mainGroup.id,
				user.primary_account,
				rank.rank
			);
			return message.success(
				`Successfully set your rank in the group ${mainGroup.id} to ${rankUser.name}`
			);
		} else {
			const input = args.slice(0).join(" ");
			const rank = verification.rank_binds.find((rank) => rank.name == input);
			if (!rank) return message.error(`Cannot find rank ${input}`);
			const ownsAsset = await getOwnership(user.primary_account, rank.assetId);
			if (ownsAsset == false)
				return message.error("You do not own the given asset.");
			const rankUser = await setRank(
				mainGroup.id,
				user.primary_account,
				rank.rank
			);
			return message.success(
				`Successfully set your rank in the group ${mainGroup.id} to ${rankUser.name}`
			);
		}
	}
}
