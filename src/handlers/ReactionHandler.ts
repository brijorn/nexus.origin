import db from "./DatabaseHandler";
import { Panel } from "typings/origin";
import { MessageReaction, Client, User } from "discord.js";
import ticketing from "@plugins/ticketing/reaction/";
export default async (bot: Client, reaction: MessageReaction, user: User) => {
	if (user.bot === true) return;

	const ticketpanel = await new Panel().get()
	if (ticketpanel.interface_enabled === true) {
		const guild = await db
		.table("guild")
		.where("guild_id", "=", reaction.message.guild!.id)
		.first();
		await ticketing(bot, guild, reaction, user, ticketpanel);
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
