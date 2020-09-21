import db from "../../handlers/DatabaseHandler";
import { Panel } from "../../lib/origin";
import { MessageReaction, Client, User } from "discord.js";
const ticketing = require("../../lib/util/");
export default async (bot: Client, reaction: MessageReaction, user: User) => {
	if (user.bot === true) return;

	const ticketpanel = await new Panel().get(reaction.message.guild!.id)
	if (ticketpanel.interface_enabled === true) {
		const guild = await db
		.table("guild")
		.where("guild_id", "=", reaction.message.guild!.id)
		.first();
		await ticketing(bot, guild);
	}
	// If its claim
	const claim = await db
		.withSchema("ticketing")
		.table("ticket_awaitingclaim")
		.where("guild_id", "=", reaction.message.guild!.id)
		.where("message_id", "=", reaction.message.id)
		.first();
	if (claim) {
		const claimpanel = await db
			.withSchema("ticketing")
			.table("ticket_interfaces")
			.where("guild_id", "=", reaction.message.guild!.id)
			.where("panel_id");
	}
};
