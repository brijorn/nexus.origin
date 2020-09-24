import { DatabaseHandler } from "./DatabaseHandler";
import { Panel } from "../typings/origin";
import { MessageReaction, User } from "discord.js";
import ticketing from "../plugins/ticketing/reaction/";
import OriginClient from "../lib/OriginClient";
export default async (
	bot: OriginClient,
	reaction: MessageReaction,
	user: User
) => {
	if (user.bot === true) return;

	const ticketpanel = await bot.handlers.database.getOne('ticketing', 'interfaces', {
		guild_id: reaction.message.guild!.id,
		create_reation: reaction.emoji.id || reaction.emoji.name
	}) as Panel

	if (ticketpanel.interface_enabled === true) {
		const guild = await bot.handlers.database.getOne("public", "guild", {
			guild_id: reaction.message.guild!.id,
		});
		await ticketing(bot, guild, reaction, user, ticketpanel);
	}
	// If its claim
	const claim = await bot.handlers.ticket.claim.fetch(reaction.message.guild!.id, { message_id: reaction.message.guild!.id })
	if (claim) {
		const claimpanel = await claim.panel()
	}
};
